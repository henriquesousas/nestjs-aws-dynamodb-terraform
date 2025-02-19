import { EventEmitter2 } from 'eventemitter2';
import { Entity } from './entity';
import { DomainEvent } from '../events/domain-events';

export abstract class AggregateRoot extends Entity {
  events: Set<DomainEvent> = new Set<DomainEvent>();
  private dispatchedchEvents: Set<DomainEvent> = new Set<DomainEvent>();
  localMediator = new EventEmitter2();

  applyEvent(event: DomainEvent) {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  registerHandler(event: string, handler: (event: DomainEvent) => void) {
    this.localMediator.on(event, handler);
  }

  markEventAsDispatched(event: DomainEvent): void {
    this.dispatchedchEvents.add(event);
  }

  getUncommittedEvents(): DomainEvent[] {
    return Array.from(this.events).filter(
      (event) => !this.dispatchedchEvents.has(event),
    );
  }

  clearEvents(): void {
    this.events.clear();
    this.dispatchedchEvents.clear();
  }
}
