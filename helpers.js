const checkExistence = function(users, email) {
  for (let key in users) {
    if (users[key]['email'] === email) {
      return key;
    }
  }
  return false;
};

const urlsForUser = function(urlDatabase, code) {
  let output = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === code) {
      output[key] = urlDatabase[key].longURL;
    }
  }
  return output;
};

const getOwner = function(urlDatabase, shortURL) {
  for (let key in urlDatabase) {
    if (key === shortURL) {
      return urlDatabase[key].userID;
    }
  }
  return false;
};

module.exports = {checkExistence, urlsForUser, getOwner};