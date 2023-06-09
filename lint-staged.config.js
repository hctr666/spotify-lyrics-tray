module.exports = {
  'src/**/*.{js,ts,tsx}': [
    'prettier --check --ignore-unknown --write',
    'yarn lint',
  ],
  'src/**/*.{ts,tsx}?(x)': () => 'yarn typecheck',
}
