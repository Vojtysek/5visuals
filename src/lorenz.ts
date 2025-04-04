import p5 from "p5";
import { GlobalConfig } from "./config";

export type LorenzConfig = GlobalConfig & {
  pointCount?: number;
  pathLength?: number;
  scale?: number;
  rotationSensitivity?: number;
  autoRotate?: boolean;
};

export function lorenzSystem(p: p5, config?: LorenzConfig) {
  const params = {
    pointCount: config?.pointCount ?? 1,
    pathLength: config?.pathLength ?? 30,
    rotationSensitivity: config?.rotationSensitivity ?? 800,
    autoRotate: config?.autoRotate ?? false,

    width: config?.width ?? 800,
    height: config?.height ?? 600,

    scale: config?.scale ?? 4,
    backgroundColor: config?.backgroundColor ?? 0,
    lineColor: config?.lineColor ?? 255,
  };

  const ro = 10;
  const sigma = 28;
  const beta = 8 / 3;
  const dt = 0.01;

  const pointsArray: p5.Vector[][] = [];
  const x = new Array(params.pointCount).fill(0).map(() => Math.random() + 1);
  const y = new Array(params.pointCount).fill(0).map(() => Math.random() + 2);
  const z = new Array(params.pointCount).fill(0).map(() => Math.random() + 2);
  let rotationAngle = 0;

  for (let i = 0; i < params.pointCount; i++) {
    pointsArray.push([]);
  }

  return {
    setup() {
      p.createCanvas(params.width, params.height, p.WEBGL);
      if (params.pointCount == 1) {
        params.pathLength = 5000;
      }
    },

    draw() {
      if (Array.isArray(params.backgroundColor)) {
        p.background(params.backgroundColor);
      } else {
        p.background(params.backgroundColor);
      }

      for (let i = 0; i < params.pointCount; i++) {
        updateLorenz(i);
        pointsArray[i].push(p.createVector(x[i], y[i], z[i]));
        if (pointsArray[i].length > params.pathLength) {
          if (params.pathLength !== 0) {
            pointsArray[i].shift();
          }
        }
      }

      if (params.autoRotate) {
        rotationAngle += 0.005;
        const camX = Math.sin(rotationAngle) * params.rotationSensitivity;
        const camY = Math.cos(rotationAngle) * params.rotationSensitivity;
        p.camera(
          camX,
          camY,
          p.height / (2 * p.tan(p.PI / 6)),
          0,
          0,
          0,
          0,
          1,
          0,
        );
      } else {
        const camX = p.map(
          p.mouseX,
          0,
          p.width,
          -params.rotationSensitivity,
          params.rotationSensitivity,
        );
        const camY = p.map(
          p.mouseY,
          0,
          p.height,
          -params.rotationSensitivity,
          params.rotationSensitivity,
        );
        p.camera(
          camX,
          camY,
          p.height / (2 * p.tan(p.PI / 6)),
          0,
          0,
          0,
          0,
          1,
          0,
        );
      }

      p.scale(params.scale);
      p.noFill();

      for (let i = 0; i < pointsArray.length; i++) {
        drawPath(pointsArray[i]);
      }
    },

    updateConfig(newConfig: LorenzConfig) {
      Object.assign(params, newConfig);
    },

    getState() {
      return {
        params,
        pointCount: pointsArray.length,
        currentPosition: pointsArray.map((path) => path[path.length - 1]),
      };
    },

    reset() {
      for (let i = 0; i < params.pointCount; i++) {
        x[i] = Math.random();
        y[i] = Math.random();
        z[i] = Math.random();
        pointsArray[i] = [];
      }
    },
  };

  function updateLorenz(i: number) {
    const dx = ro * (y[i] - x[i]) * dt;
    const dy = (x[i] * (sigma - z[i]) - y[i]) * dt;
    const dz = (x[i] * y[i] - beta * z[i]) * dt;
    x[i] += dx;
    y[i] += dy;
    z[i] += dz;
  }

  function drawPath(path: p5.Vector[]) {
    if (path.length < 2) return;

    p.strokeWeight(1);
    p.stroke(params.lineColor);
    p.noFill();

    p.beginShape();
    for (const v of path) {
      p.vertex(v.x, v.y, v.z);
    }
    p.endShape();
  }
}
