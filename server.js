const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

//Routing Middlewares
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then( () => {
    app.listen(5000, () => {
     console.log(`Running Server on port: 5000`);
      console.log("MongoDB Connected!");
    });
  })
  .catch((err) => {
    console.log(err);
  });