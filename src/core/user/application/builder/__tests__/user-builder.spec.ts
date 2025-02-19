import { Role, UserId } from '../../../../user/domain/entities/user';
import { UserBuilder } from '../user.builder';

describe('UserBuilder Unit test', () => {
  it('should create an user by UserBuilder', () => {
    const sut = new UserBuilder({
      name: 'user',
      email: 'u@gmail.com',
      password: '123',
    }).build();

    expect(sut.props.name.value).toBe('user');
    expect(sut.props.email.value).toBe('u@gmail.com');
    expect(sut.props.password.value).toBe('123');
    expect(sut.props.isActive).toBe(true);
    expect(sut.props.roles).toEqual([Role.User]);
    expect(sut.props.userId).toBeInstanceOf(UserId);
  });

  it('should create an user with helper method', () => {
    const userId = new UserId();
    const sut = new UserBuilder({
      name: 'user',
      email: 'u@gmail.com',
      password: '123',
    })
      .withIsActive(false)
      .withRole(Role.Admin)
      .withUserId(userId)
      .build();

    expect(sut.props.isActive).toBe(false);
    expect(sut.props.roles).toEqual([Role.Admin]);
    expect(sut.props.userId?.value).toBe(userId.value);
  });

  it('should create an user with more than one role', () => {
    const sut = new UserBuilder({
      name: 'user',
      email: 'u@gmail.com',
      password: '123',
    })
      .withRoles(['Admin', 'User', 'Teste'])
      .build();

    expect(sut.props.roles).toEqual([Role.Admin, Role.User]);
  });
});
