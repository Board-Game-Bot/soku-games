import Renderer from './renderer';

/**
 * The base of Controller
 */
export default abstract class Controller {
  abstract bindRenderer(renderer: Renderer, extra?: any): void;
}
