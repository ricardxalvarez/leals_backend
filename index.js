import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import passport from 'passport';
import passportPswd1 from './config/passport.pswd1.js';
import passportPswd2 from './config/passport.pswd2.js';
import session from 'express-session';
import helmet from 'helmet';
import config from './config/config.js';
const app = express();
const PORT = process.env.PORT || 5000

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
passport.use("passportPswd1", passportPswd1);
passport.use("passportPswd2", passportPswd2)
app.use(session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/', async (req, res) => {
  res.send('Welcome')
})
app.use('/', routes);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  app.options('*', (req, res) => {
    // allowed XHR methods  
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
    res.send();
  });
});

app.listen(PORT, () => {
  console.log("Servidor iniciado y en espera en puerto " + PORT);
});