export interface DomainEvent {
  aggregateId: string;
  occurredOn: Date;
  eventVersion: number;

  getIntegrationEvent?(): IDomainEventIntegration[];
}

export interface IDomainEventIntegration<T = any> {
  aggregateId: string;
  occurredOn: Date;
  eventVersion: number;
  eventName: string;
  payload: T;
}
