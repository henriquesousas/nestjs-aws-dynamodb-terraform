import { DomainNotification } from '../domain-notification';

export abstract class ValueObject {
  domainNotification = new DomainNotification();
  constructor(protected aValue: string) {
    this.validate();
  }

  abstract validate(): void;

  get value(): string {
    return this.aValue;
  }
}
