const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  
  // console.log('---------------------');
  // console.log(req.params.shortURL);
  // console.log('----------------------')

  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  console.log('---------------------');
  console.log(req.params.shortURL);
  console.log(urlDatabase[req.params.ashortURL]);
  console.log('----------------------')

  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};// What goes here?
  //let templateVars = { shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca"};// What goes here?

  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});