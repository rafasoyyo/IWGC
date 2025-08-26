module.exports = {
  coverageDirectory: "./coverage-e2e",
  moduleFileExtensions: ["js", "json", "ts"],
  preset: 'ts-jest',
  rootDir: ".",
  testEnvironment: "node",
  testRegex: "spec.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
};
