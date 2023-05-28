// @ts-nocheck

import { Validator } from '../../validator/base';
import { ValidatorImplement } from '../../validator/decorator';

@ValidatorImplement('__example__')
export class __Example__Validator extends Validator {
  checkImpl(s: string): boolean {
    return true;
  }

  afterImpl(s: string): void {}
}
