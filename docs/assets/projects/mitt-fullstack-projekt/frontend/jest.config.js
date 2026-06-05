module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    '.*\\.(vue)$': '@vue/vue3-jest',
    '.*\\.(js)$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/components/$1',
  },
};