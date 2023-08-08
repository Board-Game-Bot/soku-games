/**
 * The base of Generator
 */
export default abstract class Generator {
  abstract generate(...args: any[]): string;
}
