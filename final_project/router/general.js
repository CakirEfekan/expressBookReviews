const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios')
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.json());
public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const doesExist = isValid(username)
  if (username && password) {
    if (doesExist) {
      return res.status(400).json({ message: "This user already exists." });
    } else {
      users.push({ username, password })
      return res.status(200).json({ message: "Registration is completed. Congratulations." });
    }
  }
  else {

    return res.status(400).json({ message: "Missing argument. username and password is required." });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
 const books = await axios.get('http://localhost:5001/booksdb.json').then(response => {
   return response.data
  })

  return res.status(200).json(books);
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const books = await axios.get('http://localhost:5001/booksdb.json').then(response => {
    return response.data
   })
  const isbn = req.params.isbn
  const doesExist = Object.keys(books).filter(id => id === isbn).length > 0
  if (!doesExist) {
    return res.status(400).json({ message: "There is not avalible book with this ISBN" })
  }
  else {
    return res.status(200).json(books[isbn])
  }
});



// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const books = await axios.get('http://localhost:5001/booksdb.json').then(response => {
    return response.data
   })
  const author = req.params.author
  const requestedBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase())
  const doesExist = requestedBooks.length > 0
  if (!doesExist) {
    return res.status(400).json({ message: "There is not any books of this author" })
  } else {
    return res.status(200).json(requestedBooks)
  }
});





// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title
  const books = await axios.get('http://localhost:5001/booksdb.json').then(response => {
    return response.data
   })
  const requestedBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase())
  const doesExist = requestedBooks.length > 0
  if (!doesExist) {
    return res.status(400).json({ message: "There is not any books of this title" })
  } else {
    return res.status(200).json(requestedBooks)
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const requestedBooks = Object.keys(books).filter(id => id === isbn)
  const doesExist = requestedBooks.length > 0
  if (!doesExist) {
    return res.status(400).json({message:"There is not a book with this ISBN."})
  }
  else {
    if (requestedBooks > 1) {
      return res.status(500).json({message: "There is duplicated isbn records. Contact with administrator."})
    }
    else{
      if (Object.keys(books[isbn].reviews).length == 0) {
    return res.status(400).json({message:"There is not any reviews for this book."})
        
      }else{
        return res.status(200).json(books[isbn].reviews)

      }
    }
  }
});

module.exports.general = public_users;
