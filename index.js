import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import passport from 'passport';
import passportPswd1 from './config/passport.pswd1.js';
import passportadmin from './config/passport.admin.js';
import session from 'express-session';
import { Server as WebSocketServer } from 'socket.io'
import workers from './workers/workers.js';
import http from 'http'
import helmet from 'helmet';
import config from './config/config.js';
const app = express();
const server = http.createServer(app)
export const io = new WebSocketServer(server, { cors: '*' })
const PORT = process.env.PORT || 4200

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
passport.use("passportPswd1", passportPswd1);
passport.use("passportadmin", passportadmin);
const sessionMiddleware = session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware)
io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
})
export let users = []
const add_user = (user_id, socket_id) => {
  const user = users.find(object => object.user_id === user_id)
  if (user) {
    const new_list = [...users.filter(object => object.user_id !== user_id), { user_id, socket_id }]
    users = new_list
  } else users.push({ user_id, socket_id })
}
const remove_user = (socket_id) => {
  const new_list = users.filter(object => object.socket_id !== socket_id)
  users = new_list
}
io.on('connection', function (socket) {
  // socket.handshake.headers
  console.log(`socket.io connected: ${socket.id}`);
  socket.on("user_connection", user_id => {
    add_user(user_id, socket.id)
    // socket.request.session.users = users
    // socket.request.session.save()
  })
  // socket.request.session.io = io;
  // socket.request.session.socketio = socket.id;
  // socket.request.session.save();

  socket.on("disconnect", () => {
    remove_user(socket.id)
    // socket.request.session.users = users
    // socket.request.session.save()
  })
  // save socket.io socket in the session
  // console.log("session at socket.io connection:\n", socket.request.session);
});

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

workers()

server.listen(PORT, () => {
  console.log("Servidor iniciado y en espera en puerto " + PORT);
});