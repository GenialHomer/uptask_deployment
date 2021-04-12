// import express from 'express';
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// importar las variables .env
require('dotenv').config({ path: 'variables.env' });

// helpers con algunas funciones
const helpers = require('./helpers');

// crear la conexión a la BD
const db = require('./config/db');
// const passport = require('passport');

// importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
	.then(() => console.log(`Conectado a la BD`))
	.catch((error) => console.log(error));

// crear una app de express
const app = express();

// donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitar pug
app.set('view engine', 'pug');

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

app.use(cookieParser());
// session nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(
	session({
		secret: 'supersecreto',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// pasar vardump a la aplicacion
app.use((req, res, next) => {
	// console.log(req.user);
	res.locals.vardump = helpers.vardump;
	res.locals.mensajes = req.flash();
	res.locals.usuario = { ...req.user } || null;
	// console.log(`🚀 => file: index.js => line 65 => app.use => res.locals.usuario`, res.locals.usuario);
	next();
});

app.use('/', routes());

// servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
	console.log('===> :: EL SERVIDOR ESTA FUNCIONANDO :: <===');
});
