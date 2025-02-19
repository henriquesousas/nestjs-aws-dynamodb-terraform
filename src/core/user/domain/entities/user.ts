import { AggregateRoot } from '../../../@shared/entity/aggregate-root';
import { UUID } from '../../../@shared/value-object/uuid';
import { Email } from '../value-objects/email';
import { Name } from '../value-objects/name';
import { Password } from '../value-objects/password';

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

export class UserId extends UUID {
  constructor(userId?: string) {
    super(userId);
  }
}

export type UserProps = {
  readonly name: Name;
  readonly email: Email;
  readonly password: Password;
  readonly isActive?: boolean;
  readonly roles?: Role[];
  readonly userId?: UserId;
  readonly createdAt?: Date;
  updatedAt?: Date;
};

export class User extends AggregateRoot {
  constructor(public props: UserProps) {
    super();
    this.props = {
      ...props,
      userId: props.userId ?? new UserId(),
      isActive: props.isActive == undefined ? true : props.isActive,
      roles: props.roles ?? [Role.User],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
    this.handleDomainNotification();
  }

  public changeName(aName: string): void {
    this.props = {
      ...this.props,
      name: new Name(aName),
    };
    this.handleDomainNotification();
  }

  public activate(): void {
    this.props = {
      ...this.props,
      isActive: true,
    };
    this.handleDomainNotification();
  }

  public deactivate(): void {
    this.props = {
      ...this.props,
      isActive: false,
    };

    this.handleDomainNotification();
  }

  public uuid(): UUID {
    return this.props.userId!;
  }

  private handleDomainNotification(): void {
    const values = [
      this.props.name,
      this.props.email,
      this.props.password,
      this.props.userId,
    ];

    for (const valueObject of values) {
      if (valueObject?.domainNotification.hasErrors()) {
        this.notification.copyErrors(valueObject.domainNotification);
      }
    }
  }
}
