import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { ValueObject } from './value-object';

export class UUID extends ValueObject {
  constructor(value?: string) {
    super(value ?? uuidv4());
  }

  validate() {
    const isValid = uuidValidate(this.value);
    if (!isValid) {
      this.domainNotification.addError('ID deve ser um UUID válido');
    }
  }
}
