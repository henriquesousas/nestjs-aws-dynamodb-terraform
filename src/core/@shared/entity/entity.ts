import { DomainNotification } from '../domain-notification';
import { UUID } from '../value-object/uuid';

export abstract class Entity {
  notification: DomainNotification = new DomainNotification();
  abstract uuid(): UUID;
}
