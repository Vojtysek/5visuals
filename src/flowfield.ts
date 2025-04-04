import p5, { Vector } from "p5";
import { GlobalConfig } from "./config";

export type flowfieldConfig = GlobalConfig & {
  particleCount?: number;
  noiseScale?: number;
  noiseStrength?: number;
};

export function flowField(p: p5, config: flowfieldConfig) {
  const params = {
    particleCount: config?.particleCount ?? 100,
    noiseScale: config?.noiseScale ?? 500,
    noiseStrength: config?.noiseStrength ?? 1,

    backgroundColor: config?.backgroundColor ?? 0,
    lineColor: config?.lineColor ?? 255,

    width: config?.width ?? 800,
    height: config?.height ?? 600,
  };
  let particles: Particle[] = [];

  class Particle {
    loc = p.createVector();
    dir = p.createVector();
    speed = 0;

    constructor(_loc: Vector, _dir: Vector, _speed: number) {
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
      let angle =
        p.noise(
          this.loc.x / params.noiseScale,
          this.loc.y / params.noiseScale,
          p.frameCount / params.noiseScale,
        ) *
        p.TWO_PI *
        params.noiseStrength;
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
          2,
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
    },
  };
}
