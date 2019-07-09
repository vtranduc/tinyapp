const generateRandomString = function() {
  output = [];
  Math.floor(Math.random() * 10);
  let oneAlphaNumeric = 0;
  for (let i = 0; i < 6; i++) {
    oneAlphaNumeric = Math.floor(Math.random() * 62);
    if (oneAlphaNumeric >= 36) {
      output.push(String.fromCharCode(oneAlphaNumeric + 29));
    } else if (oneAlphaNumeric >= 10) {
      output.push(String.fromCharCode(oneAlphaNumeric + 87));
    } else {
      output.push(oneAlphaNumeric.toString());
    }
  }
  return output.join("");
};

module.exports = {generateRandomString};