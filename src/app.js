const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser')
const loginRoutes = require('./routes/login');
const cors = require('cors');
const { PORT } = require('./config.js');
const { dbConfig } = require('./db.js');

const app = express();

app.use(cors({
	origin: '*'
}));

app.set('port', PORT);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(myconnection(mysql, dbConfig, 'single'));

app.use(session({
	secret: 'secret',
	resave: true, 
	saveUninitialized: true
}));

app.listen(app.get('port'), () => {
 console.log('listening on port ', app.get('port'));
});

app.use('/user', loginRoutes);

app.get('/', (req, res) => {
	res.status(200).send({status: true})
});
