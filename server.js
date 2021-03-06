if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

// Ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

// Routes
app.use('/', require('./routes/index')); // Home routes
app.use('/authors', require('./routes/authors')); // Author routes
app.use('/books', require('./routes/books')); // Book routes

// Port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));