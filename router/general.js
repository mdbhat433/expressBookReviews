const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}
public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented register"});
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)){
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented Book List"});
 res.send(JSON.stringify(books,null,4));
});

public_users.get('/', async function (req, res) {
  try {
    // Simulate an async operation (e.g., fetching data from a remote server)
    const response = await axios.get('http://localhost:5000/books'); // Simulating the request to get books
console.log(response);
    // Since this is a local call, we'll just return the books object directly
    // If this was a remote call, response.data would contain the fetched books
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn0/:isbn',function (req, res) {
  const isbnNo = req.params.isbn;
  if (books[isbnNo]) {
    // Return the details of the book
    return res.status(200).json(books[isbnNo]);
  } else {
    // If the ISBN does not exist, return an error message
    return res.status(404).json({ message: "Book not found" });
  }
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented isbn"});
 });
 public_users.get('/isbn/:isbn', async function (req, res) {
  const isbnNo = req.params.isbn;
  try {
    // Fetching the book details using Axios
    const response = await axios.get(`http://localhost:5000/books`);
    const books = response.data;

    if (books[isbnNo]) {
      return res.status(200).json(books[isbnNo]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get book details based on author
public_users.get('/author0/:author', function (req, res) {
  const author = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive matching
  let result = [];

  // Iterate over each key in the books object
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      result.push(books[isbn]);
    }
  }

  // Check if any books were found
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    // Fetching the book details using Axios
    const response = await axios.get(`http://localhost:5000/books`);
    const books = response.data;

    let result = [];
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author) {
        result.push(books[isbn]);
      }
    }

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title0/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented title"});
  const title = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive matching
  let result = [];

  // Iterate over each key in the books object
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      result.push(books[isbn]);
    }
  }

  // Check if any books were found
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found by this title" });
  }
});
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    // Fetching the book details using Axios
    const response = await axios.get(`http://localhost:5000/books`);
    const books = response.data;

    let result = [];
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
        result.push(books[isbn]);
      }
    }

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented review isbn"});
  const isbnNo = req.params.isbn;
  if (books[isbnNo]) {

    return res.status(200).json(books[isbnNo].reviews);
  } else {

    return res.status(404).json({ message: "review not found" });
  }
});

module.exports.general = public_users;
