const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

const isValid = (username) => {
  const doesExist = users.filter(user => user.username === username).length > 0
  return doesExist;
}

const authenticatedUser = (username, password) => { //returns boolean
  const user = users.filter(user => user.username === username && user.password === password)
  return user.length === 1
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username == undefined ? null : req.body.username;
  const password = req.body.password == undefined ? null : req.body.password
  if (username === null || password == null) {
    const missingField = []
    Array.from([username, password]).filter(field => field == null).map(field => missingField.push(field))
    return res.status(400).json({
      status: 400,
      error: "Bad request",
      message: "Yet to be implemented",
      fields: missingField,
    });
  } else {
    const isAuthenticated = authenticatedUser(username, password)
    if (!isAuthenticated) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid username or password."
      })
    } else {
      const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
      return res.status(200).json({
        message: "Login successful",
        token
      })
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.user.username
  const isbn = req.params.isbn
  const review = req.body.review ?? ""
  const doesExist = Object.keys(books).includes(isbn)
  if (!doesExist) {
    return res.status(400).json({
      error: "Bad request",
      message: "There is not any book with this ISBN."
    })
  } else {
    if (review.length < 3) {
      return res.status(400).json({
        error: "Bad request",
        message: "The review cannot be less than 3 character"
      })
    } else {
      const book = books[isbn]
      book.reviews[username] = review
      return res.status(200).json({ message: "Review has added!" });
    }
  }
});


//Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.user.username
  const isbn = req.params.isbn
  const doesExist = Object.keys(books).includes(isbn)
  if (!doesExist) {
    return res.status(400).json({
      error: "Bad request",
      message: "There is not any book with this ISBN."
    })
  } else {
    const book = books[isbn]
    //book.reviews =  Object.keys(book.reviews).filter(key=>username!==key).map(username=>book.reviews[username])
    delete book.reviews[username]
    return res.status(200).json({ message: "Review has removed!" });

  }
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
