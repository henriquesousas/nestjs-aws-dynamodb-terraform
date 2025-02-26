module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],

  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    // '^@mocks/(.*)$': '<rootDir>/test/$1',
  },
};
