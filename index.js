// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { User, Product, Profile, Story, Group } = require('./models');
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
const groupsRoutes = require('./components/groups/groupRoutes')
const linkRoutes = require('./components/links/linkRoutes')


//express
const app = express();
app.use(express.json());

const allowedOrigins = ['https://plocica-front.vercel.app', 'http://localhost:3001'];


app.use(cors({
  origin: allowedOrigins,
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
app.use('/groups', groupsRoutes);
app.use('/links', linkRoutes)