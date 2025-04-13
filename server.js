const express = require('express')
const expressLayouts = require("express-ejs-layouts");
const app = express()

app.set('view engine', 'ejs')
app.use(express.static("./public"))
app.use(expressLayouts)

app.get('/', (req, res) => {
    console.log('Here')
    res.render('index')
})

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
