import { Role, User, UserId, UserProps } from '../../domain/entities/user';
import { Email } from '../../domain/value-objects/email';
import { Name } from '../../domain/value-objects/name';
import { Password } from '../../domain/value-objects/password';

export type UserBuilderProps = {
  name: string;
  email: string;
  password: string;
};

export class UserBuilder {
  private createdAt?: Date;
  private userId?: UserId;
  private isActive?: boolean;
  private roles?: Role[];

  constructor(private props: UserBuilderProps) {}

  withUserId(aUserId: UserId): UserBuilder {
    this.userId = aUserId;
    return this;
  }

  withRole(role: Role): UserBuilder {
    if (!this.roles) {
      this.roles = [];
    }
    this.roles.push(role);
    return this;
  }

  withRoles(roles: string[]): UserBuilder {
    if (!this.roles) this.roles = [];
    for (const roleName of roles) {
      const role = Role[roleName as keyof typeof Role];
      if (role) {
        this.roles.push(role);
      }
    }
    return this;
  }

  withCreatedAt(date: Date): UserBuilder {
    this.createdAt = date;
    return this;
  }

  withIsActive(isActive: boolean): UserBuilder {
    this.isActive = isActive;
    return this;
  }

  build(): User {
    const userProps: UserProps = {
      name: new Name(this.props.name),
      password: new Password(this.props.password),
      email: new Email(this.props.email),
      userId: this.userId,
      createdAt: this.createdAt,
      roles: this.roles,
      isActive: this.isActive,
    };
    return new User(userProps);
  }
}
