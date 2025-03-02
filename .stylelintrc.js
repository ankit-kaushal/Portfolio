module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier'
  ],
  plugins: [
    'stylelint-order'
  ],
  rules: {
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'order/properties-alphabetical-order': true
  }
}; 