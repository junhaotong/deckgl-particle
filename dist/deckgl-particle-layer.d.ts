import type { Buffer as Buffer_2 } from '@luma.gl/core';
import { BufferTransform } from '@luma.gl/engine';
import type { DefaultProps } from '@deck.gl/core';
import type { LayerContext } from '@deck.gl/core';
import { LineLayer } from '@deck.gl/layers';
import type { LineLayerProps } from '@deck.gl/layers';
import type { SamplerProps } from '@luma.gl/core';
import type { Texture } from '@luma.gl/core';
import type { TextureSource } from '@deck.gl/core';
import type { UpdateParameters } from '@deck.gl/core';

/**
 * Bbox
 * @public
 */
export declare type Bbox = [number, number, number, number];

/**
 * ParticleLayer
 * @public
 */
export declare class ParticleLayer<D = any, ExtraPropsT extends {} = {}> extends LineLayer<D, ExtraPropsT & Required<_ParticleLayerProps>> {
    static layerName: string;
    static defaultProps: DefaultProps<ParticleLayerProps<unknown>>;
    state: LineLayer['state'] & {
        initialized?: boolean;
        numInstances?: number;
        numAgedInstances?: number;
        sourcePositions?: Buffer_2;
        targetPositions?: Buffer_2;
        instanceColors?: Buffer_2;
        transform?: BufferTransform;
        colorTexture?: Texture;
        frame?: number;
    };
    getShaders(): any;
    initializeState(): void;
    updateState(params: UpdateParameters<this>): void;
    finalizeState(context: LayerContext): void;
    draw({ uniforms }: {
        uniforms: any;
    }): void;
    _setupTransformFeedback(): void;
    _runTransformFeedback(): void;
    _deleteTransformFeedback(): void;
    step(): void;
    clear(): void;
    _createColorTexture(colors: Record<number, string>): Texture;
}

/**
 * ParticleLayerProps
 * @public
 */
export declare type ParticleLayerProps<D = unknown> = _ParticleLayerProps & LineLayerProps<D>;

declare type _ParticleLayerProps = {
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
    emptyData?: number;
    animate?: boolean;
    boundsClip?: boolean;
    textureParameters?: SamplerProps;
};

export { }
