const express = require('express');
const connectDB = require('./config/db');
const app = express();
// connect database
connectDB();
// Init MiddleWare
app.use(
  express.json({
    extended: false
  })
);
app.get('/', (request, response) => response.send('API running'));

//Defines routes
app.use('/api/users', require('./routes/api/users.js'));
app.use('/api/posts', require('./routes/api/posts.js'));
app.use('/api/auth', require('./routes/api/auth.js'));
app.use('/api/profile', require('./routes/api/profile.js'));

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
