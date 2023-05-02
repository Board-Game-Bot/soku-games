import { generate } from '@/game-redesign/data.generator.decorator';
import '@/game-redesign';
import { describe, it, expect, beforeAll } from 'vitest';

describe('game-snake-generator', () => {
  let data: any;
  beforeAll(() => {
    data = generate('snake', {
      r: 12,
      c: 13,
      wallCount: 20,
    });
  });
  it('test', () => {
    expect(data.rc).toBe((12 << 16) | 13);
    expect(data.mask.length).toBe(12 * 13);
  });
});
