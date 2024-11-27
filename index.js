// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { User, Product, Profile, Story } = require('./models');
// const { Product } = require('./models')
// const { Profile } = require('./models')
// const { Story } = require('./models')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//routes
const userRoutes = require('./components/user/userRoutes')
const productRoutes = require('./components/product/productRoutes')
const profileRoutes = require('./components/profile/profileRoutes')
const storyRoutes = require('./components/story/storyRoutes')
const eventRoutes = require('./components/events/eventRoutes')
const mediaRoutes = require('./components/media/mediaRoutes')
//express
const app = express();
app.use(express.json());



app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', async (req, res) => {
  res.send("Radi server");
})

app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/profiles', profileRoutes)
app.use('/stories', storyRoutes)
app.use('/events', eventRoutes)
app.use('/media', mediaRoutes);