
if(typeof(window) == 'undefined' || typeof(window.teoria) == 'undefined') {
  window = {};
  require('../../dist/teoria.js');
}

module.exports = window.teoria;
