import { LineLayer } from '@deck.gl/layers/typed';
import type { LineLayerProps } from '@deck.gl/layers/typed';
import type { UpdateParameters } from '@deck.gl/core/typed';

/**
 * Bbox
 * @public
 */
export declare type Bbox = [number, number, number, number];

/**
 * ParticleLayer
 * @public
 */
export declare class ParticleLayer<D = any, ExtraPropsT = any> extends LineLayer<D, ExtraPropsT & ParticleLayerProps<D>> {
    getShaders(): any;
    initializeState(): void;
    updateState({ props, oldProps, changeFlags }: UpdateParameters<this>): void;
    finalizeState(): void;
    draw({ uniforms }: {
        uniforms: any;
    }): void;
    _setupTransformFeedback(): void;
    _runTransformFeedback(): void;
    _deleteTransformFeedback(): void;
    step(): void;
    clear(): void;
    getColorRamp(colors: Record<number, string>): string;
}

/**
 * ParticleLayerProps
 * @public
 */
export declare type ParticleLayerProps<D> = LineLayerProps<D> & {
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
    emptyData?: number;
    animate?: number;
    boundsClip?: boolean;
};

export { }
