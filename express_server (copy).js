const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

//============================

var cookieParser = require('cookie-parser');
app.use(cookieParser());

const users = { 
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

}
//============================

const {generateRandomString} = require('./stringGenerator');
const {checkExistence} = require('./accessoryFunctions')


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get('/login', (req, res) => {
  res.render('urls_login');
})

app.post('/login/loggingin', (req, res) => {

  const key = checkExistence(users, req.body.chosenUsername);
  if (key) {
    if (users[key]["password"] === req.body.chosenPassword) {
      res.cookie("username", req.body.chosenUsername)
      res.redirect('/urls/')
    } else {
      res.status(403).send("Wrong password")
    }
  } else {
    res.status(403).send("email not found in database")
  }
});


app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls/');
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls/' + shortURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  let templateVars = {username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};// What goes here?
  res.render("urls_show", templateVars);
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls/')
})

app.post('/urls/:shortURL/add', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls/')
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/registration', (req, res) => {
  res.render("urls_registration",{username: req.cookies.username})
});

app.post('/registration', (req, res) => {
  res.render("urls_registration",{username: req.cookies.username})
})

app.post('/registration/registering', (req,res)=>{
  if (req.body.chosenPassword==="" || req.body.chosenUsername===""){
    res.status(400).send("username and password must not be empty");
  } else if (checkExistence(users,req.body.chosenUsername)) {
      res.status(400).send("username already exists");
  } else {
    const newUser = {
      id: generateRandomString(),
      email: req.body.chosenUsername,
      password: req.body.chosenPassword
    };
    users[newUser.id] = newUser;
    res.cookie("username", newUser.email)
    res.redirect('/urls')
  }
})

//=====================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});