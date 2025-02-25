import { UserBuilder } from '@core/user/application/builder/user.builder';
import { LocalUserRepository } from '../local/local_user.repository';

describe('LocalUserRepository', () => {
  it('should create an user', async () => {
    const sut = new LocalUserRepository();

    const user = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    const userId = await sut.create(user);
    expect(userId.value).toEqual(user.props.userId?.value);
  });

  it('should take all users', async () => {
    const sut = new LocalUserRepository();

    const user1 = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    const user2 = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    const userId1 = await sut.create(user1);
    const userId2 = await sut.create(user2);
    const users = await sut.findAll();

    expect(users.length).toEqual(2);
    expect(users[0].props.userId?.value).toEqual(userId1.value);
    expect(users[1].props.userId?.value).toEqual(userId2.value);
  });

  it('should find by id', async () => {
    const sut = new LocalUserRepository();

    const user = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    const userId = await sut.create(user);
    const users = await sut.findBy({
      userId: user.props.userId?.value,
    });

    expect(users[0].props.userId?.value).toEqual(userId.value);
  });

  it('should find by email', async () => {
    const sut = new LocalUserRepository();

    const user = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    await sut.create(user);
    const users = await sut.findBy({
      email: user.props.email.value,
    });

    expect(users[0].props.email?.value).toEqual(user.props.email.value);
  });

  it('should return empty if find user no filter provided', async () => {
    const sut = new LocalUserRepository();

    const user = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    await sut.create(user);
    const users = await sut.findBy({});

    expect(users.length).toEqual(0);
  });

  it('should find user by userId and email', async () => {
    const sut = new LocalUserRepository();

    const user = new UserBuilder({
      email: 'fake@mail.com',
      name: 'any',
      password: 'any123',
    }).build();

    await sut.create(user);
    const users = await sut.findBy({
      userId: user.props.userId!.value,
      email: user.props.email.value,
    });

    expect(users[0].props.userId?.value).toEqual(user.props.userId!.value);
  });
});
