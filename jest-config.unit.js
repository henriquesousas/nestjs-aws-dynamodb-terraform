// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config');
config.displayName = 'Unit tests';
config.testMatch = ['**/*.spec.ts'];
// config.testRegex = '.*\\.spec\\.ts$';
module.exports = config;
