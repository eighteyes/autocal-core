import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/','<rootDir>/tests/']
  // setupFilesAfterEnv: ['./tests/bootstrap.ts']
};
export default config;