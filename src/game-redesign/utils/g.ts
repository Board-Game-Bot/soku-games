export class G {
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
  }

  Rect(options: {
    x: number;
    y: number;
    lx: number;
    ly: number;
    color?: string;
  }) {
    const { x, y, lx, ly, color } = options;
    const c = this.context;

    c.fillStyle = color || '#000';
    c.fillRect(x, y, lx, ly);
  }

  Cir(options: { x: number; y: number; radius: number; color?: string }) {
    const { x, y, radius, color } = options;
    const c = this.context;

    c.fillStyle = color || '#000';
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2);
    c.fill();
  }

  Seg(options: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    width: number;
    color?: string;
  }) {
    const { x0, y0, x1, y1, width, color } = options;
    const c = this.context;
    c.save();
    c.lineWidth = width;
    c.strokeStyle = color || '#000';
    c.beginPath();
    c.moveTo(x0, y0);
    c.lineTo(x1, y1);
    c.closePath();
    c.stroke();
    c.restore();
  }

  Segs(options: { ps: [number, number][]; width: number; color?: string }) {
    const { ps, width, color } = options;
    ps.reduce((pre, cur) => {
      this.Seg({
        x0: pre[0],
        y0: pre[1],
        x1: cur[0],
        y1: cur[1],
        width: width,
        color: color,
      });
      return cur;
    });
  }

  Text(options: {
    x: number;
    y: number;
    text: string;
    font: string;
    color?: string;
  }) {
    const { x, y, text, font, color } = options;
    const c = this.context;
    c.font = font;
    c.fillStyle = color || '#000';
    c.fillText(text, x, y);
  }

  Poly(options: { ps: number[][]; color?: string }) {
    const { ps, color } = options;
    const c = this.context;
    c.beginPath();
    ps.forEach(([x, y], idx) => {
      if (!idx) c.moveTo(y, x);
      else c.lineTo(y, x);
    });
    c.closePath();
    c.fillStyle = color || '#000000';
    c.fill();
  }

  StrokePoly(options: { ps: number[][]; width?: number; color?: string }) {
    const { ps, width, color } = options;
    const c = this.context;
    c.save();
    c.beginPath();
    ps.forEach(([x, y], idx) => {
      if (!idx) c.moveTo(y, x);
      else c.lineTo(y, x);
    });
    c.closePath();
    c.strokeStyle = color || '#000000';
    c.lineWidth = width || 1;
    c.stroke();
    c.restore();
  }

  Hex(options: { x: number; y: number; radius: number; color?: string }) {
    const { x, y, radius, color } = options;
    const v = new Vector(-radius, 0);
    const lst: [number, number][] = [];
    new Array(6).fill(0).forEach(() => {
      const nv = new Vector(x, y).add(v);
      lst.push([nv.x, nv.y]);
      v.rot(Math.PI / 3);
    });
    this.Poly({
      ps: lst,
      color: color,
    });
  }

  StrokeHex(options: {
    x: number;
    y: number;
    radius: number;
    width?: number;
    color?: string;
  }) {
    const { x, y, radius, width, color } = options;
    const v = new Vector(-radius, 0);
    const lst: [number, number][] = [];
    new Array(6).fill(0).forEach(() => {
      const nv = new Vector(x, y).add(v);
      lst.push([nv.x, nv.y]);
      v.rot(Math.PI / 3);
    });
    this.StrokePoly({
      ps: lst,
      width: width,
      color: color,
    });
  }
}

export class Vector {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  public sub(vec: Vector) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  public rot(deg: number) {
    const { x, y } = this;
    const { nx, ny } = {
      nx: x * Math.cos(deg) + y * Math.sin(deg),
      ny: -x * Math.sin(deg) + y * Math.cos(deg),
    };
    this.x = nx;
    this.y = ny;
    return this;
  }

  public mul(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }
}
