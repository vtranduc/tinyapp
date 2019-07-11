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
  },

  "yaminoma": {
    id: "yaminoma", 
    email: "aaa", 
    password: "aaa"
  }
};

let urlDatabaseSpecific = {};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  test1: { longURL: "https://youtube.com", userID: "yaminoma" },
  test2: { longURL: "https://pornhub.com", userID: "yaminoma" }
};
//============================

const {generateRandomString} = require('./stringGenerator');
const {checkExistence, urlsForUser, getOwner} = require('./accessoryFunctions')




const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabaseSpecific);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  

    // console.log('IM IN YOU')
    // console.log(users[req.cookies["username"]])
    // console.log(users)
    // console.log(req.cookies["username"])
  // console.log("we are happy");
  // console.log(req.cookies["username"])

  if (req.cookies["username"] === undefined && Object.keys(urlDatabaseSpecific).length !== 0) {
    urlDatabaseSpecific = {};
  }

  let templateVars = { 
    username: users[req.cookies["username"]],
    urls: urlDatabaseSpecific };

  res.render("urls_index", templateVars);
});

app.get('/login', (req, res) => {
  res.render('urls_login');
})

app.post('/login/loggingin', (req, res) => {

  const key = checkExistence(users, req.body.chosenUsername);
  if (key) {
    if (users[key]["password"] === req.body.chosenPassword) {
      res.cookie("username", key)

      urlDatabaseSpecific = urlsForUser(urlDatabase, key);
      // console.log('nozomi kawaii')
      // console.log(urlDatabaseSpecific)

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
  urlDatabaseSpecific = {};
  res.redirect('/urls/');
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  urlDatabaseSpecific[shortURL] = longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.cookies["username"]
  };


  res.redirect('/urls/' + shortURL);
});

app.get("/urls/new", (req, res) => {
  //console.log('rin chan brainstorm')
  //console.log(req.cookies["username"])
  if (req.cookies["username"]) {
    let templateVars = {username: users[req.cookies["username"]]}
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login')
  }
});

app.get("/urls/:shortURL", (req, res) => {

  const owner = getOwner(urlDatabase, req.params.shortURL);
  if (owner === req.cookies["username"]) {
    let templateVars = {
      username: users[req.cookies["username"]],
      shortURL: req.params.shortURL,
      longURL: urlDatabaseSpecific[req.params.shortURL]};
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("You are not authorized to edit this URL")
  }


});

app.post("/urls/:shortURL", (req, res) => {
  let templateVars = {username: users[req.cookies["username"]], shortURL: req.params.shortURL, longURL: urlDatabaseSpecific[req.params.shortURL]};// What goes here?
  res.render("urls_show", templateVars);
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabaseSpecific[req.params.shortURL];
  res.redirect('/urls/')
})

app.post('/urls/:shortURL/add', (req, res) => {
  urlDatabaseSpecific[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls/')
})

app.get("/u/:shortURL", (req, res) => {
  //const longURL = urlDatabaseSpecific[req.params.shortURL];
  if (urlDatabase[req.params.shortURL].longURL) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.status(403).send("url does not exist BITCH!")
  }
});

app.get('/registration', (req, res) => {
  res.render("urls_registration",{username: users[req.cookies.username]})
});

app.post('/registration', (req, res) => {
  res.render("urls_registration",{username: users[req.cookies.username]})
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
    

    res.cookie("username", newUser.id)
    res.redirect('/urls')
  }
})

//=====================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});