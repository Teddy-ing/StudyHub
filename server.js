const express = require('express')
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const app = express()

app.set('view engine', 'ejs')
app.use(express.static("./public"))
app.use(expressLayouts)

app.get('/', (req, res) => {
    console.log('Here')
    res.render('index')
})

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-west-2_JjpQyV3az",
  tokenUse  : "id",            
  clientId  : "4bj04na9rjlm5vvkbvqj2hp76v",
});

//cors middleware
app.use(cors({
  origin: [
    'http://study-hub-s3-bucket-high-cost.s3-website-us-west-2.amazonaws.com'
  ]
}));                                         // :contentReference[oaicite:3]{index=3}


app.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    req.auth = await verifier.verify(token); // throws if bad / expired
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

//example api call
app.post('/notes', (req, res) => {
  console.log(req.body);           // do real work here
  res.json({ status: 'saved' });
});

// now all routes are protected
app.get("/profile", (req, res) => {
  res.json({ email: req.auth.email });
});

app.get("/", function (req, res) {
  res.render("index", { title: "Home" });
});

app.get("/timer", function (req, res) {
  res.render("timer");
});

app.get("/notes", function (req, res) {
  res.render("notes");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(3000, function () {
  console.log("Server is running on localhost3000");
});
