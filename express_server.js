const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

//============================

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//============================

const {generateRandomString} = require('./stringGenerator');

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

//=====================================================================

app.get("/urls", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase };
  //console.log(templateVars.username)
  //console.log('Inside of app.get urls/')
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {

  res.cookie('username',req.body.chosenUsername);
  // console.log('have set cookies')

  // console.log(req.cookies["username"])

  res.redirect('/urls/')
});

app.post("/logout", (req, res) => {
  //res.cookie('username', undefined);

  //console.log('-----------===================-------------------')

  res.clearCookie("username");
  //console.log('-----------===================-------------------')

  res.redirect('/urls/');
});

//=====================================================================

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
    longURL: urlDatabase[req.params.shortURL]};// What goes here?
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

//=====================================================

app.post('/registration', (req, res) => {
  res.render("urls_registration",{username: req.cookies.username})
})

//=====================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});