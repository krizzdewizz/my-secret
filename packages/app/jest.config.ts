/* eslint-disable */
export default {
  displayName: 'app',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/packages/app',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
