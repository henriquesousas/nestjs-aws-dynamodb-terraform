import { ValueObject } from '../../../@shared/value-object/value-object';

export class Password extends ValueObject {
  validate(): void {
    if (this.value.length < 5 || this.value.length > 10) {
      this.domainNotification.addError(
        'Senha deve estar entre 5 e 10 caracteres',
        'password',
      );
    }
  }
}
