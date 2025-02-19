import { ValueObject } from '../../../@shared/value-object/value-object';

export class Email extends ValueObject {
  validate(): void {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
    if (!isValid) {
      this.domainNotification.addError('Email inválido', 'email');
    }
  }
}
