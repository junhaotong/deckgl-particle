import {LineLayer} from '@deck.gl/layers';
import {BufferTransform} from '@luma.gl/engine';
import type {Buffer, Texture, SamplerProps} from '@luma.gl/core';
import type {ShaderModule} from '@luma.gl/shadertools';
import type {LineLayerProps} from '@deck.gl/layers';
import type {DefaultProps, LayerContext, TextureSource, UpdateParameters} from '@deck.gl/core';
import updateTransformVs from './particle-layer-update-transform.vs.glsl';
import distance from '@turf/distance';

/**
 * Bbox
 * @public
 */
export type Bbox = [number, number, number, number]

const DEFAULT_TEXTURE_PARAMETERS: SamplerProps = {
    addressModeU: 'repeat',
}

// uniforms of the particle update transform
const transformUniformBlock = `\
uniform particleUniforms {
  vec4 bounds;
  vec4 viewportBounds;
  vec2 viewportSphereCenter;
  float viewportSphereRadius;
  float viewportSphere;
  float viewportSpeedFactor;
  float numParticles;
  float maxAge;
  float time;
  float seed;
} particle;
`;

const transformUniforms = {
    name: 'particle',
    vs: transformUniformBlock,
    uniformTypes: {
        bounds: 'vec4<f32>',
        viewportBounds: 'vec4<f32>',
        viewportSphereCenter: 'vec2<f32>',
        viewportSphereRadius: 'f32',
        viewportSphere: 'f32',
        viewportSpeedFactor: 'f32',
        numParticles: 'f32',
        maxAge: 'f32',
        time: 'f32',
        seed: 'f32',
    },
} as const satisfies ShaderModule;

// uniforms of the particle rendering
const windUniformBlock = `\
uniform windUniforms {
  vec4 bounds;
  vec2 windMin;
  vec2 windMax;
  float emptyData;
} wind;
`;

const windUniforms = {
    name: 'wind',
    fs: windUniformBlock,
    uniformTypes: {
        bounds: 'vec4<f32>',
        windMin: 'vec2<f32>',
        windMax: 'vec2<f32>',
        emptyData: 'f32',
    },
} as const satisfies ShaderModule;

const DEFAULT_COLORS = {
    0.0: '#3288bd',
    0.1: '#66c2a5',
    0.2: '#abdda4',
    0.3: '#e6f598',
    0.4: '#fee08b',
    0.5: '#fdae61',
    0.6: '#f46d43',
    1.0: '#d53e4f'
};

const clipBox = (bbox1: Bbox, bbox2: Bbox): Bbox => {
    return [
        Math.max(bbox1[0], bbox2[0]),
        Math.max(bbox1[1], bbox2[1]),
        Math.min(bbox1[2], bbox2[2]),
        Math.min(bbox1[3], bbox2[3])
    ]
}

type _ParticleLayerProps = {
    /** wind image, u in the red channel, v in the green channel */
    image: string | TextureSource | null;
    bounds?: Bbox;
    numParticles?: number;
    maxAge?: number;
    speedFactor?: number;
    colors?: Record<number, string>;
    width?: number;
    uWindMin?: number;
    uWindMax?: number;
    vWindMin?: number;
    vWindMax?: number;
    emptyData?: number; // empty RG value, 0-255
    animate?: boolean;
    boundsClip?: boolean;
    textureParameters?: SamplerProps;
}

/**
 * ParticleLayerProps
 * @public
 */
export type ParticleLayerProps<D = unknown> = _ParticleLayerProps & LineLayerProps<D>;

const defaultProps: DefaultProps<ParticleLayerProps> = {
    image: {type: 'image', value: null, async: true},
    bounds: {type: 'array', value: [-180, -90, 180, 90], compare: true},
    textureParameters: {type: 'object', value: DEFAULT_TEXTURE_PARAMETERS, compare: true, ignore: true},

    numParticles: {type: 'number', min: 1, max: 1000000, value: 5000},
    maxAge: {type: 'number', min: 1, max: 255, value: 100},
    speedFactor: {type: 'number', min: 0, max: 1, value: 1},
    colors: {type: 'object', value: DEFAULT_COLORS, compare: true},
    width: {type: 'number', value: 1},
    uWindMin: {type: 'number', value: 0},
    emptyData: {type: 'number', value: 0},
    uWindMax: {type: 'number', value: 0},
    vWindMin: {type: 'number', value: 0},
    vWindMax: {type: 'number', value: 0},
    animate: true,
    boundsClip: {type: 'boolean', value: false},
};

/**
 * ParticleLayer
 * @public
 */
export class ParticleLayer<D = any, ExtraPropsT extends {} = {}> extends LineLayer<D, ExtraPropsT & Required<_ParticleLayerProps>> {
    static layerName = 'ParticleLayer';
    static defaultProps = defaultProps;

    declare state: LineLayer['state'] & {
        initialized?: boolean;
        numInstances?: number;
        numAgedInstances?: number;
        sourcePositions?: Buffer;
        targetPositions?: Buffer;
        instanceColors?: Buffer;
        transform?: BufferTransform;
        colorTexture?: Texture;
        frame?: number;
    };

    getShaders() {
        const parentShaders = super.getShaders();

        return {
            ...parentShaders,
            modules: [...parentShaders.modules, windUniforms],
            inject: {
                'vs:#decl': `
          out float drop;
          out vec2 positionWind;
          const vec2 DROP_POSITION = vec2(0);
        `,
                'vs:#main-start': `
          drop = float(instanceSourcePositions.xy == DROP_POSITION || instanceTargetPositions.xy == DROP_POSITION);
        `,
                'vs:#main-end': `
          positionWind = instanceTargetPositions.xy;
        `,
                'fs:#decl': `
          in float drop;
          in vec2 positionWind;
          uniform sampler2D windTexture;
          uniform sampler2D colorTexture;
          vec2 getUV(vec2 pos) {
            return vec2(
              (pos.x - wind.bounds[0]) / (wind.bounds[2] - wind.bounds[0]),
              (pos.y - wind.bounds[3]) / (wind.bounds[1] - wind.bounds[3])
            );
          }
        `,
                'fs:#main-start': `
          if (drop > 0.5) discard;
        `,
                'fs:#main-end': `
          vec2 windUV = getUV(positionWind.xy);
          vec2 windXY = texture(windTexture, windUV).xy;
          vec2 velocity = mix(wind.windMin, wind.windMax, windXY);
          float speed = length(velocity);
          float maxSpeed = length(wind.windMax);
          float colorPos = speed / maxSpeed;
          if (windXY.x == wind.emptyData && windXY.y == wind.emptyData) {
            fragColor.a = 0.;
          } else {
            fragColor = vec4(texture(colorTexture, vec2(colorPos, 0.5)).rgb, fragColor.a);
          }
        `
            },
        };
    }

    initializeState() {
        super.initializeState();

        // positions and colors are provided by the transform feedback buffers, not by the data accessors
        const attributeManager = this.getAttributeManager()!;
        attributeManager.remove(['instanceSourcePositions', 'instanceTargetPositions', 'instanceColors', 'instanceWidths']);
        attributeManager.addInstanced({
            instanceSourcePositions: {size: 3, type: 'float32', noAlloc: true},
            instanceTargetPositions: {size: 3, type: 'float32', noAlloc: true},
            instanceColors: {size: 4, type: 'float32', noAlloc: true},
            // constant attributes
            instanceSourcePositions64Low: {size: 3, type: 'float32', noAlloc: true},
            instanceTargetPositions64Low: {size: 3, type: 'float32', noAlloc: true},
            instanceWidths: {size: 1, type: 'float32', noAlloc: true},
        });
    }

    updateState(params: UpdateParameters<this>) {
        super.updateState(params);

        const {props, oldProps} = params;

        if (
            props.image !== oldProps.image ||
            props.numParticles !== oldProps.numParticles ||
            props.maxAge !== oldProps.maxAge
        ) {
            this._setupTransformFeedback();
        }

        if (props.colors !== oldProps.colors || !this.state.colorTexture) {
            this.state.colorTexture?.destroy();
            this.setState({colorTexture: this._createColorTexture(props.colors)});
        }
    }

    finalizeState(context: LayerContext) {
        this._deleteTransformFeedback();
        this.state.colorTexture?.destroy();

        super.finalizeState(context);
    }

    draw({uniforms}: { uniforms: any }) {
        const {initialized} = this.state;
        if (!initialized) {
            return;
        }

        const {animate, image, bounds, width, uWindMin, uWindMax, vWindMin, vWindMax, emptyData} = this.props;
        const {model, colorTexture} = this.state;
        if (!image || typeof image === 'string' || !model || !colorTexture) {
            return;
        }

        if (animate) {
            this._runTransformFeedback();
        }

        const {sourcePositions, targetPositions, instanceColors} = this.state;

        model.setAttributes({
            instanceSourcePositions: sourcePositions!,
            instanceTargetPositions: targetPositions!,
            instanceColors: instanceColors!,
        });
        model.setConstantAttributes({
            instanceSourcePositions64Low: new Float32Array([0, 0, 0]),
            instanceTargetPositions64Low: new Float32Array([0, 0, 0]),
            instanceWidths: new Float32Array([width]),
        });
        model.shaderInputs.setProps({
            wind: {
                bounds,
                windMin: [uWindMin, vWindMin],
                windMax: [uWindMax, vWindMax],
                emptyData: emptyData / 255,
            },
        });
        model.setBindings({
            windTexture: image as Texture,
            colorTexture,
        });

        super.draw({uniforms});

        if (animate) {
            this.setNeedsRedraw();
        }
    }

    _setupTransformFeedback() {
        const {device} = this.context;
        const {numParticles, maxAge} = this.props;
        const {initialized} = this.state;

        if (initialized) {
            this._deleteTransformFeedback();
        }

        // sourcePositions/targetPositions buffer layout:
        // |          age0         |          age1         |          age2         |...|          ageN         |
        // |pos1,pos2,pos3,...,posN|pos1,pos2,pos3,...,posN|pos1,pos2,pos3,...,posN|...|pos1,pos2,pos3,...,posN|
        const numInstances = numParticles * maxAge;
        const numAgedInstances = numParticles * (maxAge - 1);
        const sourcePositions = device.createBuffer({data: new Float32Array(numInstances * 3)});
        const targetPositions = device.createBuffer({data: new Float32Array(numInstances * 3)});
        const colors = new Float32Array(numInstances * 4);
        for (let i = 0; i < numInstances; i++) {
            const age = Math.floor(i / numParticles);
            colors[i * 4] = 1;
            colors[i * 4 + 1] = 1;
            colors[i * 4 + 2] = 1;
            colors[i * 4 + 3] = 1 - age / maxAge;
        }
        const instanceColors = device.createBuffer({data: colors});

        // only the newest generation (age0) is transformed, older generations are shifted by a buffer copy
        const transform = new BufferTransform(device, {
            attributes: {
                sourcePosition: sourcePositions,
            },
            bufferLayout: [
                {name: 'sourcePosition', format: 'float32x3'},
            ],
            feedbackBuffers: {
                targetPosition: targetPositions,
            },
            vs: updateTransformVs,
            varyings: ['targetPosition'],
            modules: [transformUniforms],
            vertexCount: numParticles,
        });

        this.setState({
            initialized: true,
            numInstances,
            numAgedInstances,
            sourcePositions,
            targetPositions,
            instanceColors,
            transform,
            frame: 0,
        });
    }

    _runTransformFeedback() {
        const {initialized} = this.state;
        if (!initialized) {
            return;
        }

        const {device, viewport} = this.context;
        const {image, bounds, numParticles, speedFactor, maxAge, boundsClip} = this.props;
        const {numAgedInstances, transform, frame} = this.state;
        const sourcePositions = this.state.sourcePositions!;
        const targetPositions = this.state.targetPositions!;

        if (!image || typeof image === 'string' || !transform) {
            return;
        }

        const viewportSphere = (viewport as any).resolution ? 1 : 0; // globe
        const {longitude, latitude} = viewport as unknown as {longitude: number, latitude: number};
        const viewportSphereCenter = [longitude, latitude];
        const viewportSphereRadius = Math.max(
            distance(viewportSphereCenter, viewport.unproject([0, 0]), {units: 'meters'}),
            distance(viewportSphereCenter, viewport.unproject([viewport.width / 2, 0]), {units: 'meters'}),
            distance(viewportSphereCenter, viewport.unproject([0, viewport.height / 2]), {units: 'meters'}),
        );

        const viewportBounds = viewport.getBounds() as Bbox;
        // viewportBounds[0] = Math.max(viewportBounds[0], -180);
        viewportBounds[1] = Math.max(viewportBounds[1], -85.051129);
        // viewportBounds[2] = Math.min(viewportBounds[2], 180);
        viewportBounds[3] = Math.min(viewportBounds[3], 85.051129);

        // speed factor for current zoom level
        const devicePixelRatio = window.devicePixelRatio;
        const viewportSpeedFactor = speedFactor * devicePixelRatio / 2 ** viewport.zoom;

        // age particles
        // copy age0-age(N-1) sourcePositions to age1-ageN targetPositions
        if (numAgedInstances! > 0) {
            const commandEncoder = device.createCommandEncoder();
            commandEncoder.copyBufferToBuffer({
                sourceBuffer: sourcePositions,
                sourceOffset: 0,
                destinationBuffer: targetPositions,
                destinationOffset: numParticles * 4 * 3,
                size: numAgedInstances! * 4 * 3,
            });
            device.submit(commandEncoder.finish());
        }

        // update particles
        // write new age0 targetPositions from age0 sourcePositions
        transform.model.shaderInputs.setProps({
            particle: {
                bounds,
                numParticles,
                maxAge,

                viewportSphere,
                viewportSphereCenter,
                viewportSphereRadius,
                viewportBounds: boundsClip ? clipBox(viewportBounds, bounds) : viewportBounds,
                viewportSpeedFactor,

                time: frame!,
                seed: Math.random(),
            },
        });
        transform.model.setBindings({speedTexture: image as Texture});
        transform.run({
            inputBuffers: {sourcePosition: sourcePositions},
            outputBuffers: {targetPosition: targetPositions},
            clearColor: false,
            clearDepth: false,
            clearStencil: false,
        });

        // swap, the just written buffer is the source of the next step
        this.setState({
            sourcePositions: targetPositions,
            targetPositions: sourcePositions,
            frame: frame! + 1,
        });
    }

    _deleteTransformFeedback() {
        const {initialized, sourcePositions, targetPositions, instanceColors, transform} = this.state;

        if (!initialized) {
            return;
        }

        sourcePositions?.destroy();
        targetPositions?.destroy();
        instanceColors?.destroy();
        transform?.destroy();

        this.setState({
            initialized: false,
            sourcePositions: undefined,
            targetPositions: undefined,
            instanceColors: undefined,
            transform: undefined,
        });
    }

    step() {
        this._runTransformFeedback();

        this.setNeedsRedraw();
    }

    clear() {
        const {initialized, numInstances, sourcePositions, targetPositions} = this.state ?? {};
        if (!initialized) {
            return;
        }

        sourcePositions!.write(new Float32Array(numInstances! * 3));
        targetPositions!.write(new Float32Array(numInstances! * 3));

        this.setNeedsRedraw();
    }

    _createColorTexture(colors: Record<number, string>): Texture {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        canvas.width = 256;
        canvas.height = 1;

        const gradient = ctx.createLinearGradient(0, 0, 256, 0);
        for (const stop in colors) {
            gradient.addColorStop(+stop, colors[stop]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 1);

        return this.context.device.createTexture({
            width: 256,
            height: 1,
            format: 'rgba8unorm',
            data: new Uint8Array(ctx.getImageData(0, 0, 256, 1).data.buffer),
            sampler: {
                minFilter: 'linear',
                magFilter: 'linear',
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge',
            },
        });
    }
}
