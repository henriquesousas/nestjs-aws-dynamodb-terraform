import { ValueObject } from '../../../@shared/value-object/value-object';

export class Name extends ValueObject {
  validate(): void {
    if (this.value.trim().length < 1 || this.value.trim().length > 100) {
      this.domainNotification.addError(
        'Nome deve estar entre 5 e 100 caracteres',
      );
    }
  }
}
