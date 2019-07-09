const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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
  
  // console.log('---------------------');
  // console.log(req.params.shortURL);
  // console.log('----------------------')

  res.render("hello_world", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)

  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  // console.log(shortURL);
  // console.log(urlDatabase[shortURL]);

  // console.log(urlDatabase);

  //res.redirect(`/urls/${shortURL}`);

  res.redirect('/urls/' + 'shortURL');

});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  // console.log('---------------------');
  // console.log(req.params.shortURL);
  // console.log(urlDatabase[req.params.ashortURL]);
  // console.log('----------------------')

  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};// What goes here?
  //let templateVars = { shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca"};// What goes here?

  res.render("urls_show", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  // console.log('fdasfadsfasf')
  // console.log(urlDatabase)
  res.redirect('/urls/')
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});