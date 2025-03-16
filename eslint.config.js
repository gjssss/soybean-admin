// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  ignores: ['**/._*'],
}, {
  rules: {
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-useless-flag': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-useless-quantifier': 'off',
  },
})
