const express = require('express');
const connectDB = require('./config/db.js');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables from .env file

//app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: false, limit: '200mb' }));
// for frontend
const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  optionsSuccessStatus: 200,
};
app.use(function (req, res, next) {
  //Enabling CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

/// important  for json parsing !!!!!!!
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors(corsOptions)); // before routing !!!!!!!

//routes define
const userRouter = require('./routes/user.route');
const studentRouter = require('./routes/student.route');
const skillRouter = require('./routes/skill.route');
const domainRouter = require('./routes/domain.route');
const offerRouter = require('./routes/offer.route');
const applicationRouter = require('./routes/application.route');
const statRouter = require('./routes/stat.route');

//routes prefix
app.use('/users', userRouter);
app.use('/students', studentRouter);
app.use('/skill', skillRouter);
app.use('/domain', domainRouter);
app.use('/offre', offerRouter);
app.use('/application', applicationRouter);
app.use('/stat', statRouter);

//////////////////////////////////////////////////////
app.get('/', function (req, res) {
  sc.createtype(req, res);
});

// Connexion à la base de données
connectDB();

app.use(function (req, res) {
  res.sendStatus(404);
}); // response upon wrong http

// Create a Server
let server = app.listen('8000', 'localhost', function () {
  let host = server.address().address;
  let port = server.address().port;
  let msg = 'App listening at http://' + host + ':' + port;
  console.log(msg);
});
