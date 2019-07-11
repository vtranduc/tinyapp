const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['toronto'],
  maxAge: 24 * 60 * 60 * 1000
}));

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },

  "yaminoma": {
    id: "yaminoma",
    email: "aaa",
    password: bcrypt.hashSync("aaa", 10)
  }
};


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  test1: { longURL: "https://youtube.com", userID: "yaminoma" },
  test2: { longURL: "https://ualberta.ca", userID: "yaminoma" }
};

const {generateRandomString} = require('./stringGenerator');
const {checkExistence, urlsForUser, getOwner} = require('./helpers');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  if (req.session.userID) {
    res.redirect("/urls/");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlsForUser(urlDatabase, req.session.userID));
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  if (req.session.userID) {
    let templateVars = {
      username: users[req.session.userID],
      urls: urlsForUser(urlDatabase, req.session.userID) };
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send("You need to be logged in to use this feature")
  }
});

app.get('/login', (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls')
  } else {
    res.render('urls_login');
  }
});

app.post('/login/loggingin', (req, res) => {
  const key = checkExistence(users, req.body.chosenUsername);
  if (key) {
    if (bcrypt.compareSync(req.body.chosenPassword, users[key].password)) {
      req.session.userID = key;
      res.redirect('/urls/');
    } else {
      res.status(403).send("Wrong password");
    }
  } else {
    res.status(403).send("email not found in database");
  }
});

app.post("/logout", (req, res) => {
  req.session.userID = null;
  res.redirect('/login');
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlsForUser(urlDatabase, req.session.userID)[shortURL] = longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.userID
  };
  res.redirect('/urls/' + shortURL);
});

app.get("/urls/new", (req, res) => {
  if (req.session.userID) {
    let templateVars = {username: users[req.session.userID]};
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const owner = getOwner(urlDatabase, req.params.shortURL);
  if (owner === req.session.userID) {
    let templateVars = {
      username: users[req.session.userID],
      shortURL: req.params.shortURL,
      longURL: urlsForUser(urlDatabase, req.session.userID)[req.params.shortURL]};
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("You are not authorized to edit this URL");
  }
});

app.post("/urls/:shortURL", (req, res) => {
  let templateVars = {username: users[req.session.userID], shortURL: req.params.shortURL, longURL: urlsForUser(urlDatabase, req.session.userID)[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  if (req.session.userID) {
    if (urlDatabase[req.params.shortURL].userID === req.session.userID) {
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls/');
    } else {
      res.status(403).send("You are not authorized to perform this action")
    }
  } else {
    res.status(403).send("You must be logged in to perform this action")
  }
});

app.post('/urls/:shortURL/add', (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls/');
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.status(403).send("url does not exist");
  }
});

app.get('/register', (req, res) => {
  if (!req.session.userID) {
    res.render("urls_registration",{username: users[req.session.userID]});
  } else {
    res.redirect('/urls');
  }
});

app.post('/registration', (req, res) => {
  // res.render("urls_registration",{username: users[req.session.userID]});
  res.redirect("/register");
});

app.post('/register', (req,res)=>{
  if (req.body.chosenPassword === "" || req.body.chosenUsername === "") {
    res.status(400).send("username and password must not be empty");
  } else if (checkExistence(users,req.body.chosenUsername)) {
    res.status(400).send("username already exists");
  } else {
    const newUser = {
      id: generateRandomString(),
      email: req.body.chosenUsername,
      password: bcrypt.hashSync(req.body.chosenPassword,10)
    };
    users[newUser.id] = newUser;
    req.session.userID = newUser.id;
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});