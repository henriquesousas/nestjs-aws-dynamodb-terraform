/* eslint-disable @typescript-eslint/no-require-imports */
const config = require('./jest.config');
config.displayName = 'Unit tests';
config.testMatch = ['**/*.spec.ts'];
// config.testRegex = '.*\\.spec\\.ts$';
module.exports = config;

// import config from './jest.config';

// config.displayName = 'Unit tests';
// config.testMatch = ['**/*.spec.ts'];

// // config.testRegex = '.*\\.spec\\.ts$';
// export default config;
