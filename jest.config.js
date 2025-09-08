export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/tests/**',
    '!src/index.js',
    '!src/main.jsx',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
}
