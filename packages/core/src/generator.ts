/**
 * The base of Generator
 */
export abstract class Generator {
  abstract generate(...args: any[]): string;
}
