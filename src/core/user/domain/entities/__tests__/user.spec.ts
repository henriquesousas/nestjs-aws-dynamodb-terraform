import { Email } from '../../value-objects/email';
import { Name } from '../../value-objects/name';
import { Password } from '../../value-objects/password';
import { Role, User, UserId } from '../user';

describe('User Unit Test', () => {
  it.only('should create a user', () => {
    const sut = new User({
      name: new Name('user'),
      email: new Email('u@gmail.com'),
      password: new Password('123456'),
    });

    expect(sut.props.name.value).toBe('user');
    expect(sut.props.email.value).toBe('u@gmail.com');
    expect(sut.props.password.value).toBe('123456');
    expect(sut.props.isActive).toBeDefined();
    expect(sut.props.roles).toEqual([Role.User]);
    expect(sut.props.userId).toBeInstanceOf(UserId);
  });

  it('should change the user name', () => {
    const sut = new User({
      name: new Name('user'),
      email: new Email('u@gmail.com'),
      password: new Password('123456'),
    });

    sut.changeName('user2');

    expect(sut.props.name.value).toBe('user2');
    expect(sut.props.email.value).toBe('u@gmail.com');
    expect(sut.props.password.value).toBe('123456');
    expect(sut.props.isActive).toBeDefined();
    expect(sut.props.roles).toEqual([Role.User]);
    expect(sut.props.userId).toBeInstanceOf(UserId);
  });
});
