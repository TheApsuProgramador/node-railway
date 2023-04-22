const express = require('express');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const loginRoutes = require('./routes/login');
const paypalRoutes = require('./routes/paypal');
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

app.listen(app.get('port'), () => {
 console.log('listening on port ', app.get('port'));
});

app.use('/user', loginRoutes);
app.use('/paypal', paypalRoutes);

app.get('/', (req, res) => {
	res.status(200).send({status: true})
});
