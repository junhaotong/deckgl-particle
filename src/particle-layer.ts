import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {LineLayer} from '@deck.gl/layers';
import {Buffer, Transform, Texture2D} from '@luma.gl/core';
import GL from '@luma.gl/constants';
import {LineLayerProps} from '@deck.gl/layers';
import updateTransformVs from './particle-layer-update-transform.vs.glsl';
import distance from '@turf/distance';
import {UpdateStateInfo} from '@deck.gl/core/lib/layer';

/**
 * Bbox
 * @public
 */
export type Bbox = [number, number, number, number]

const DEFAULT_TEXTURE_PARAMETERS = {
    [GL.TEXTURE_WRAP_S]: GL.REPEAT,
}

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

/**
 * ParticleLayerProps
 * @public
 */
export type ParticleLayerProps<D> = LineLayerProps<D> & {
    image: string;
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
    animate?: number;
    boundsClip?: boolean;
}

const defaultProps = {
    ...LineLayer.defaultProps,

    image: {type: 'image', value: null, async: true},
    bounds: {type: 'array', value: [-180, -90, 180, 90], compare: true},
    _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    textureParameters: DEFAULT_TEXTURE_PARAMETERS,

    numParticles: {type: 'number', min: 1, max: 1000000, value: 5000},
    maxAge: {type: 'number', min: 1, max: 255, value: 100},
    speedFactor: {type: 'number', min: 0, max: 1, value: 1},
    colors: {type: 'object', value: DEFAULT_COLORS},
    width: {type: 'number', value: 1},
    uWindMin: {type: 'number', value: 0},
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
export class ParticleLayer<D = any, ExtraPropsT = any> extends LineLayer<D, ExtraPropsT & ParticleLayerProps<D>> {
    getShaders() {
        return {
            ...super.getShaders(),
            inject: {
                'vs:#decl': `
          varying float drop;
          varying vec2 positionWind;
          const vec2 DROP_POSITION = vec2(0);
        `,
                'vs:main': `
        `,
                'vs:#main-start': `
          drop = float(instanceSourcePositions.xy == DROP_POSITION || instanceTargetPositions.xy == DROP_POSITION);
        `,
                'vs:#main-end': `
          positionWind = instanceTargetPositions.xy;
        `,
                'fs:#decl': `
          varying float drop;
          varying vec2 positionWind;
          uniform sampler2D uWind;
          uniform sampler2D colorTexture;
          uniform vec4 bounds;
          uniform float uWindMin;
          uniform float uWindMax;
          uniform float vWindMin;
          uniform float vWindMax;
          vec2 getUV(vec2 pos) {
            return vec2(
              (pos.x - bounds[0]) / (bounds[2] - bounds[0]),
              (pos.y - bounds[3]) / (bounds[1] - bounds[3])
            );
          }
        `,
                'fs:#main-start': `
          if (drop > 0.5) discard;
        `,
                'fs:#main-end': `
          vec2 windUV = getUV(positionWind.xy);
          vec2 windMax = vec2(uWindMax, vWindMax);
          vec2 windMin = vec2(uWindMin, vWindMin);
          vec2 velocity = mix(windMin, windMax, texture2D(uWind, windUV).xy);
          float speed = length(velocity);
          float maxSpeed = length(windMax);
          float colorPos = speed / maxSpeed;

          gl_FragColor = vec4(texture2D(colorTexture, vec2(colorPos, 0.)).rgb, gl_FragColor.a);
        `
            },
        };
    }

    initializeState() {
        super.initializeState({});

        this._setupTransformFeedback();

        const attributeManager = this.getAttributeManager();
        attributeManager?.remove(['instanceSourcePositions', 'instanceTargetPositions', 'instanceColors', 'instanceWidths']);
    }

    updateState({props, oldProps, changeFlags}: UpdateStateInfo<ParticleLayerProps<D>>) {
        super.updateState({props, oldProps, changeFlags} as UpdateStateInfo<ExtraPropsT & ParticleLayerProps<D>>);

        if (
            props.image !== oldProps.image ||
            props.numParticles !== oldProps.numParticles ||
            props.maxAge !== oldProps.maxAge ||
            props.colors !== oldProps.colors ||
            props.width !== oldProps.width ||
            props.uWindMin !== oldProps.uWindMin ||
            props.uWindMax !== oldProps.uWindMax ||
            props.vWindMin !== oldProps.vWindMin ||
            props.vWindMax !== oldProps.vWindMax
        ) {
            this._setupTransformFeedback();
        }
    }

    finalizeState() {
        this._deleteTransformFeedback();

        super.finalizeState();
    }

    draw({uniforms}: { uniforms: any }) {
        const {animate, image, bounds, uWindMin, uWindMax, vWindMin, vWindMax} = this.props;
        const {sourcePositions, targetPositions, sourcePositions64Low, targetPositions64Low, widths, model, colorTexture, instanceColors} = this.state;

        if (animate) {
            this._runTransformFeedback();
        }

        model.setAttributes({
            instanceSourcePositions: sourcePositions,
            instanceTargetPositions: targetPositions,
            instanceSourcePositions64Low: sourcePositions64Low,
            instanceTargetPositions64Low: targetPositions64Low,
            instanceColors,
            instanceWidths: widths,
        });

        model.setUniforms({
            uWind: image,
            colorTexture,
            bounds,
            uWindMin,
            uWindMax,
            vWindMin,
            vWindMax
        })

        super.draw({uniforms});
        this.setNeedsRedraw();
    }

    _setupTransformFeedback() {
        const {gl} = this.context;
        const {numParticles, maxAge, colors, width} = this.props;
        const {initialized} = this.state;

        if (initialized) {
            this._deleteTransformFeedback();
        }

        // sourcePositions/targetPositions buffer layout:
        // |          age0         |          age1         |          age2         |...|          ageN         |
        // |pos1,pos2,pos3,...,posN|pos1,pos2,pos3,...,posN|pos1,pos2,pos3,...,posN|...|pos1,pos2,pos3,...,posN|
        const numInstances = numParticles! * maxAge!;
        const numAgedInstances = numParticles! * (maxAge! - 1);
        const sourcePositions = new Buffer(gl, new Float32Array(numInstances * 3));
        const targetPositions = new Buffer(gl, new Float32Array(numInstances * 3));
        const sourcePositions64Low = new Float32Array([0, 0, 0]); // constant attribute
        const targetPositions64Low = new Float32Array([0, 0, 0]); // constant attribute
        const instanceColors = new Buffer(gl, new Float32Array(new Array(numInstances).fill(undefined).map((_, i) => {
            const age = Math.floor(i / numParticles!);
            return [255, 255, 255, 255 * (1 - age / maxAge!)].map(d => d / 255);
        }).flat()));
        const widths = new Float32Array([width!]); // constant attribute

        const transform = new Transform(gl, {
            sourceBuffers: {
                sourcePosition: sourcePositions
            },
            feedbackBuffers: {
                targetPosition: targetPositions
            },
            feedbackMap: {
                sourcePosition: 'targetPosition',
            },
            vs: updateTransformVs,
            elementCount: numInstances,
        });

        const colorTexture = new Texture2D(gl, {
            data: this.getColorRamp(colors!)
        })

        this.setState({
            initialized: true,
            numInstances,
            numAgedInstances,
            sourcePositions,
            targetPositions,
            sourcePositions64Low,
            targetPositions64Low,
            instanceColors,
            widths,
            transform,
            colorTexture
        });
    }

    _runTransformFeedback() {
        // @ts-ignore
        const {viewport, timeline} = this.context;
        const {image, bounds, numParticles, speedFactor, maxAge, boundsClip} = this.props;
        const {numAgedInstances, transform} = this.state;

        if (!image) {
            return;
        }

        // @ts-ignore
        const viewportSphere = viewport.resolution ? 1 : 0; // globe
        // @ts-ignore
        const viewportSphereCenter = [viewport.longitude, viewport.latitude];
        const viewportSphereRadius = Math.max(
            distance(viewportSphereCenter, viewport.unproject([0, 0]), {units: 'meters'}),
            distance(viewportSphereCenter, viewport.unproject([viewport.width / 2, 0]), {units: 'meters'}),
            distance(viewportSphereCenter, viewport.unproject([0, viewport.height / 2]), {units: 'meters'}),
        );

        // @ts-ignore
        const viewportBounds = viewport.getBounds();
        // viewportBounds[0] = Math.max(viewportBounds[0], -180);
        viewportBounds[1] = Math.max(viewportBounds[1], -85.051129);
        // viewportBounds[2] = Math.min(viewportBounds[2], 180);
        viewportBounds[3] = Math.min(viewportBounds[3], 85.051129);

        // speed factor for current zoom level
        const devicePixelRatio = window.devicePixelRatio;
        const viewportSpeedFactor = speedFactor! * devicePixelRatio / 2 ** viewport.zoom;

        // age particles
        // copy age0-age(N-1) targetPositions to age1-ageN sourcePositions
        const sourcePositions = transform.bufferTransform.bindings[transform.bufferTransform.currentIndex].sourceBuffers.sourcePosition;
        const targetPositions = transform.bufferTransform.bindings[transform.bufferTransform.currentIndex].feedbackBuffers.targetPosition;
        sourcePositions.copyData({
            sourceBuffer: targetPositions,
            readOffset: 0,
            writeOffset: numParticles! * 4 * 3,
            size: numAgedInstances * 4 * 3,
        });

        // update particles
        const uniforms = {
            speedTexture: image,
            bounds,
            numParticles,
            maxAge,

            viewportSphere,
            viewportSphereCenter,
            viewportSphereRadius,
            viewportBounds: boundsClip ? clipBox(viewportBounds, bounds!) : viewportBounds,
            viewportSpeedFactor,

            time: timeline.getTime(),
            seed: Math.random(),
        };
        transform.run({uniforms});
        transform.swap();
    }

    _deleteTransformFeedback() {
        const {initialized, sourcePositions, targetPositions, instanceColors, transform} = this.state;

        if (!initialized) {
            return;
        }

        sourcePositions.delete();
        targetPositions.delete();
        instanceColors.delete();
        transform.delete();

        this.setState({
            initialized: false,
            sourcePositions: undefined,
            targetPositions: undefined,
            sourcePositions64Low: undefined,
            targetPositions64Low: undefined,
            instanceColors: undefined,
            widths: undefined,
            transform: undefined,
            colorTexture: undefined
        });
    }

    step() {
        this._runTransformFeedback();

        this.setNeedsRedraw();
    }

    clear() {
        const {numInstances, sourcePositions, targetPositions} = this.state;

        sourcePositions.subData({data: new Float32Array(numInstances * 3)});
        targetPositions.subData({data: new Float32Array(numInstances * 3)});

        this.setNeedsRedraw();
    }

    getColorRamp(colors: Record<number, string>): string {
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
        return canvas.toDataURL();
    }
}


ParticleLayer.layerName = 'ParticleLayer';
ParticleLayer.defaultProps = defaultProps;
