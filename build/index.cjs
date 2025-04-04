"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  doublePendelum: () => doublePendelum,
  flowField: () => flowField,
  lorenzSystem: () => lorenzSystem
});
module.exports = __toCommonJS(index_exports);

// src/lorenz.ts
function lorenzSystem(p, config) {
  const params = {
    pointCount: config?.pointCount ?? 1,
    pathLength: config?.pathLength ?? 30,
    rotationSensitivity: config?.rotationSensitivity ?? 800,
    autoRotate: config?.autoRotate ?? false,
    width: config?.width ?? 800,
    height: config?.height ?? 600,
    scale: config?.scale ?? 4,
    backgroundColor: config?.backgroundColor ?? 0,
    lineColor: config?.lineColor ?? 255
  };
  const ro = 10;
  const sigma = 28;
  const beta = 8 / 3;
  const dt = 0.01;
  const pointsArray = [];
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
        params.pathLength = 5e3;
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
        rotationAngle += 5e-3;
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
          0
        );
      } else {
        const camX = p.map(
          p.mouseX,
          0,
          p.width,
          -params.rotationSensitivity,
          params.rotationSensitivity
        );
        const camY = p.map(
          p.mouseY,
          0,
          p.height,
          -params.rotationSensitivity,
          params.rotationSensitivity
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
          0
        );
      }
      p.scale(params.scale);
      p.noFill();
      for (let i = 0; i < pointsArray.length; i++) {
        drawPath(pointsArray[i]);
      }
    },
    updateConfig(newConfig) {
      Object.assign(params, newConfig);
    },
    getState() {
      return {
        params,
        pointCount: pointsArray.length,
        currentPosition: pointsArray.map((path) => path[path.length - 1])
      };
    },
    reset() {
      for (let i = 0; i < params.pointCount; i++) {
        x[i] = Math.random();
        y[i] = Math.random();
        z[i] = Math.random();
        pointsArray[i] = [];
      }
    }
  };
  function updateLorenz(i) {
    const dx = ro * (y[i] - x[i]) * dt;
    const dy = (x[i] * (sigma - z[i]) - y[i]) * dt;
    const dz = (x[i] * y[i] - beta * z[i]) * dt;
    x[i] += dx;
    y[i] += dy;
    z[i] += dz;
  }
  function drawPath(path) {
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

// src/doublependelum.ts
function doublePendelum(p, config) {
  const params = {
    width: config?.width ?? 800,
    height: config?.height ?? 600,
    gravityForce: config?.gravityForce ?? 1,
    scale: config?.scale ?? 8,
    backgroundColor: config?.backgroundColor ?? 0,
    lineColor: config?.lineColor ?? 255
  };
  const l1 = params.height / 4;
  const l2 = params.height / 4;
  const m1 = params.scale;
  const m2 = params.scale;
  let a1 = 0;
  let a2 = 0;
  let a1_v = 0;
  let a2_v = 0;
  let a1_a = 0;
  let a2_a = 0;
  const g = params.gravityForce;
  let px2 = null;
  let py2 = null;
  let pg;
  let startTime = 0;
  const resetInterval = 15 * 1e3;
  return {
    setup() {
      p.createCanvas(params.width, params.height);
      pg = p.createGraphics(p.windowWidth, p.windowHeight);
      pg.background(params.backgroundColor);
      a1 = p.PI / 2;
      a2 = p.PI / 2;
      startTime = p.millis();
      p.frameRate(60);
    },
    draw() {
      const elapsed = p.millis() - startTime;
      p.image(pg, 0, 0);
      a1_a = (-g * (2 * m1 + m2) * p.sin(a1) + -m2 * g * p.sin(a1 - 2 * a2) + -2 * p.sin(a1 - a2) * m2 * a2_v * a2_v * l2 + a1_v * a1_v * l1 * p.cos(a1 - a2)) / (l1 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)));
      a2_a = 2 * p.sin(a1 - a2) * (a1_v * a1_v * l1 * (m1 + m2) + g * (m1 + m2) * p.cos(a1) + a2_v * a2_v * l2 * m2 * p.cos(a1 - a2)) / (l2 * (m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)));
      let x1 = l1 * Math.sin(a1);
      let y1 = l1 * Math.cos(a1);
      let x2 = l1 * Math.sin(a1) + l2 * Math.sin(a2);
      let y2 = l1 * Math.cos(a1) + l2 * Math.cos(a2);
      p.stroke(params.lineColor);
      p.translate(p.width / 2, p.height / 4);
      p.fill(params.lineColor);
      p.ellipse(x1, y1, 20, 20);
      p.line(0, 0, x1, y1);
      p.ellipse(x2, y2, 20, 20);
      p.line(x1, y1, x2, y2);
      if (p.frameCount > 1) {
        if (px2 !== null && py2 !== null) {
          pg.stroke(params.lineColor, 50);
          pg.line(
            px2 + p.width / 2,
            py2 + p.height / 4,
            x2 + p.width / 2,
            y2 + p.height / 4
          );
        }
      }
      px2 = x2;
      py2 = y2;
      a1_v += a1_a;
      a2_v += a2_a;
      a1 += a1_v;
      a2 += a2_v;
      if (elapsed > resetInterval) {
        a1 = p.PI / 2 + Math.random() * 0.1;
        a2 = p.PI / 2;
        a1_v = 0;
        a2_v = 0;
        a1_a = 0;
        a2_a = 0;
        px2 = null;
        py2 = null;
        pg.clear();
        pg.background(params.backgroundColor);
        startTime = p.millis();
      }
    }
  };
}

// src/flowfield.ts
function flowField(p, config) {
  const params = {
    particleCount: config?.particleCount ?? 100,
    noiseScale: config?.noiseScale ?? 500,
    noiseStrength: config?.noiseStrength ?? 1,
    backgroundColor: config?.backgroundColor ?? 0,
    lineColor: config?.lineColor ?? 255,
    width: config?.width ?? 800,
    height: config?.height ?? 600
  };
  let particles = [];
  class Particle {
    loc = p.createVector();
    dir = p.createVector();
    speed = 0;
    constructor(_loc, _dir, _speed) {
      this.loc = _loc;
      this.dir = _dir;
      this.speed = _speed;
    }
    run() {
      this.move();
      this.checkEdges();
      this.update();
    }
    move() {
      let angle = p.noise(
        this.loc.x / params.noiseScale,
        this.loc.y / params.noiseScale,
        p.frameCount / params.noiseScale
      ) * p.TWO_PI * params.noiseStrength;
      this.dir.x = p.cos(angle);
      this.dir.y = p.sin(angle);
      var vel = this.dir.copy();
      vel.mult(this.speed);
      this.loc.add(vel);
    }
    checkEdges() {
      if (this.loc.x <= 0) {
        this.loc.x = p.width;
      } else if (this.loc.x >= p.width) {
        this.loc.x = 0;
      } else if (this.loc.y >= p.height) {
        this.loc.y = 0;
      } else if (this.loc.y <= 0) {
        this.loc.y = p.height;
      }
    }
    update() {
      p.fill(params.lineColor);
      p.ellipse(this.loc.x, this.loc.y, this.loc.z);
    }
  }
  return {
    setup() {
      p.createCanvas(params.width, params.height);
      p.noStroke();
      for (let i = 0; i < params.particleCount; i++) {
        var loc = p.createVector(
          p.random(params.width * 1.2),
          p.random(params.height),
          2
        );
        var angle = 0;
        var dir = p.createVector(p.cos(angle), p.sin(angle));
        var speed = p.random(0.5, 2);
        particles[i] = new Particle(loc, dir, speed);
      }
    },
    draw() {
      p.fill(params.backgroundColor, 10);
      p.noStroke();
      p.rect(0, 0, params.width, params.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].run();
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  doublePendelum,
  flowField,
  lorenzSystem
});
