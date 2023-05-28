import { IPosition } from '../../../utils/c';

const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

export class Snake {
  cells = <IPosition[]>[];

  init(pos: IPosition) {
    this.cells.push([...pos]);
    return this;
  }

  memoriesBody = <IPosition[][]>[];
  next(d: number, incr: boolean) {
    const [hx, hy] = this.cells[0];
    const nextCell = <IPosition>[hx + dx[d], hy + dy[d]];
    const currentState = [...this.cells];

    this.cells.unshift(nextCell);

    if (!incr) {
      this.cells.pop();
    }

    this.memoriesBody.push(currentState);
  }

  rev() {
    if (this.memoriesBody.length) {
      this.cells = this.memoriesBody.pop()!;
    }
  }
}
