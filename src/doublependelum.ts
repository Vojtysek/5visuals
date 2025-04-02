import p5 from "p5";
import { GlobalConfig } from "./config";

export type pendelumConfig = GlobalConfig & {};

export function doublePendelum(p: p5, config: pendelumConfig) {
  const params = {
    width: config?.width ?? 800,
    height: config?.height ?? 600,

    scale: config?.scale ?? 8,
    backgroundColor: config?.backgroundColor ?? 255,
    lineColor: config?.lineColor ?? 0,
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
  const g = 1;

  let px2: number | null = null;
  let py2: number | null = null;

  let pg: p5.Graphics;

  let startTime = 0;
  const resetInterval = 15 * 1000;

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
      a1_a =
        (-g * (2 * m1 + m2) * p.sin(a1) +
          -m2 * g * p.sin(a1 - 2 * a2) +
          -2 * p.sin(a1 - a2) * m2 * a2_v * a2_v * l2 +
          a1_v * a1_v * l1 * p.cos(a1 - a2)) /
        (l1 * (2 * m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)));

      a2_a =
        (2 *
          p.sin(a1 - a2) *
          (a1_v * a1_v * l1 * (m1 + m2) +
            g * (m1 + m2) * p.cos(a1) +
            a2_v * a2_v * l2 * m2 * p.cos(a1 - a2))) /
        (l2 * (m1 + m2 - m2 * p.cos(2 * a1 - 2 * a2)));

      let x1 = l1 * Math.sin(a1);
      let y1 = l1 * Math.cos(a1);

      let x2 = l1 * Math.sin(a1) + l2 * Math.sin(a2);
      let y2 = l1 * Math.cos(a1) + l2 * Math.cos(a2);

      p.translate(p.width / 2, p.height / 4);
      p.fill(0);

      p.ellipse(x1, y1, 20, 20);
      p.line(0, 0, x1, y1);
      p.ellipse(x2, y2, 20, 20);
      p.line(x1, y1, x2, y2);

      if (p.frameCount > 1) {
        if (px2 !== null && py2 !== null) {
          pg.stroke(0, 50);
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
        pg.background(255);

        startTime = p.millis();
      }
    },
  };
}
