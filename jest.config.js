module.exports = {
  testEnvironment: 'jsdom',
  restoreMocks: true,
  resetMocks: false,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/test.(js|jsx|ts|tsx)',
    '**/*.test.(js|jsx|ts|tsx)',
    '**/__tests__/*.test.(js|jsx|ts|tsx)',
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
  setupFiles: ['<rootDir>/jest.setup.js'],
}
