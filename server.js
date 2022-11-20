const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/task');


// Set routes
app.use('/', indexRouter);
app.use('/task', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
