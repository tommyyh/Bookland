const express = require('express');
const Author = require('../models/author');
const Book = require('../models/book');

const router = express.Router();

// All Authors route
router.get('/', async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  
  try {
    const authors = await Author.find(searchOptions);  
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    }); 
  } catch {
    res.redirect('/');
  }
});

// New Authors route
router.get('/new', (req, res) => {
  res.render('authors/new', {
    author: new Author()
  });
});

// Create author router
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${author.id}`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating user'
    });
  }
});

// Show author with id
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const book = await Book.find({ author: author.id }).limit(6).exec();

    res.render('authors/show', {
      author: author,
      booksByAuthor: book
    });
  } catch {
    res.redirect('/');
  }
});

// Edit author
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    res.render('authors/edit', {
      author: author
    });
  } catch {
    res.redirect('/authors');
  }
});

// Update author
router.put('/:id', async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect('/');
    } else {
      res.render('authors/edit', { 
        author: author,
        errorMessage: 'Error updating user'
      });
    }
  }
});

// Delete Author
router.delete('/:id', async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    
    await author.remove();
    res.redirect(`/authors`);
  } catch {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;