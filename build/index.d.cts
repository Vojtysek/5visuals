import p5 from 'p5';

type GlobalConfig = {
    backgroundColor?: number;
    lineColor?: number;
    scale?: number;
    width?: number;
    height?: number;
};

type LorenzConfig = GlobalConfig & {
    pointCount?: number;
    pathLength?: number;
    scale?: number;
    rotationSensitivity?: number;
    autoRotate?: boolean;
};
declare function lorenzSystem(p: p5, config?: LorenzConfig): {
    setup(): void;
    draw(): void;
    updateConfig(newConfig: LorenzConfig): void;
    getState(): {
        params: {
            pointCount: number;
            pathLength: number;
            rotationSensitivity: number;
            autoRotate: boolean;
            width: number;
            height: number;
            scale: number;
            backgroundColor: number;
            lineColor: number;
        };
        pointCount: number;
        currentPosition: p5.Vector[];
    };
    reset(): void;
};

type pendelumConfig = GlobalConfig & {
    gravityForce?: number;
};
declare function doublePendelum(p: p5, config: pendelumConfig): {
    setup(): void;
    draw(): void;
};

type flowfieldConfig = GlobalConfig & {
    particleCount?: number;
    noiseScale?: number;
    noiseStrength?: number;
};
declare function flowField(p: p5, config: flowfieldConfig): {
    setup(): void;
    draw(): void;
};

export { type LorenzConfig, doublePendelum, flowField, type flowfieldConfig, lorenzSystem, type pendelumConfig };
