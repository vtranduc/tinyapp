const checkExistence = function(users, email) {
  for (let key in users) {
    if (users[key]['email'] === email) {
      return key;
    }
  }
  return false;
};

// const checkUserDataBase = function(users, email) {
//   for (key in users) {
//     if (users[key]['email'] === email) {
//       return true;
//     }
//   }
//   return false;
// }


module.exports = {checkExistence};