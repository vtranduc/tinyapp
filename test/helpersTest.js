const { assert } = require('chai');
const {checkExistence, urlsForUser, getOwner} = require('../helpers')

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('checkExistence', function() {
  it('should return a user with valid email', function() {
    const user = checkExistence(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return a user with valid email', function() {
    const user = checkExistence(testUsers, "user3@example.com");
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });

});