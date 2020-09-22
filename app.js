// Main Modules connecting
const express = require('express');
const appRoutes = require('./routes/appRoutes')
const tasksRoutes = require('./routes/tasksRoutes')
const usersRoutes = require('./routes/usersRoutes')
const morgan = require('morgan');
const mongoose = require('mongoose');

// DB connection
const DBURI = 'mongodb+srv://DbAdmin:justpassword@coder-gym.w3ywk.mongodb.net/coder-gym?retryWrites=true&w=majority'
mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log();
  })
  .catch((err) => {
    console.log(err);
  })

// Express init
const app = express();
const port = proccess.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://127.0.0.1:${port}`);
})

app.use('/users', usersRoutes)

app.use('/tasks', appRoutes);

app.use('/', tasksRoutes);


// app.use((req, res) => {
//   res.status(404).render('404', { title: 'Error' });
// })
