import { UserRepository } from 'src/core/user/domain/user.repository';

export const mockUserRepository: UserRepository = {
  findBy: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
};
