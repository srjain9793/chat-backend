const express = require('express');
const bodyParser = require('body-parser');
// create express app
const app = express();

const port = process.env.PORT || 5000;
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
const routes = require('./routes');
app.use('/api', routes);
// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});