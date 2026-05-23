import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/testing/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/packages/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.routes.ts',
    '!src/**/index.ts',
    '!src/main*.ts',
    '!src/server.ts',
    '!src/environments/**',
    '!src/testing/**',
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@environments/(.*)$': '<rootDir>/src/environments/$1',
  },
};

export default config;
