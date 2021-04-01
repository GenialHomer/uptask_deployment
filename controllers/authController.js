// AuthController.js
const passport = require('passport');

const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true,
	badRequestMessage: 'Ambos campos son obligatorios ',
});

// funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
	// si el usuario esta autenticado, adelante
	if (req.isAuthenticated()) {
		return next();
	}

	// sino esta autenticado, redirigir al formulario
	return res.redirect('/iniciar-sesion');
};

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/iniciar-sesion'); //al cerrar sesion nos lleva al login
	});
};

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
	// verificar que el usuario existe
	const { email } = req.body;
	const usuario = await Usuarios.findOne({ where: { email } });

	// si no existe el usuario
	if (!usuario) {
		req.flash('error', 'No existe esa cuenta');
		res.render('/restablecer');
	}

	// usuario existe
	usuario.token = crypto.randomBytes(20).toString('hex');
	// console.log(`🚀 => file: authController.js => line 48 => exports.enviarToken= => token`, token);
	usuario.expiracion = Date.now() + 3600000;

	// guardar en la base de datos
	await usuario.save();

	// url de reset
	const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
	// const resetUrl = `${location.origin}/restablecer/${usuario.token}`;
	// const url = `${location.origin}/tareas/${idTarea}`;

	// console.log(`🚀 => file: authController.js => line 56 => exports.enviarToken= => resetUrl`, resetUrl);
	// console.log(`🚀 => file: authController.js => line 56 => exports.enviarToken= => resetUrl`, req.headers.host);

	// enviar el correo con el token
	await enviarEmail.enviar({
		usuario,
		subject: 'Password Reset',
		resetUrl,
		archivo: 'reestablecer-password',
	});

	// terminar
	req.flash('correcto', 'se envió un mensaje a tu correo');
	res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
	// res.json(req.params.token);
	const usuario = await Usuarios.findOne({
		where: {
			token: req.params.token,
		},
	});
	console.log(`🚀 => file: authController.js => line 66 => exports.resetPassword= => usuario`, usuario);

	// si no hay usuario
	if (!usuario) {
		req.flash('error', 'No Válido');
		res.redirect('/restablecer');
	}

	// formulario para generar el password
	res.render('resetPassword', {
		nombrePagina: 'Restablecer Contraseña',
	});
};

// cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
	// console.log(req.params.token);
	// verificar el token valido pero tambien la fecha de expiracion
	const usuario = await Usuarios.findOne({
		where: {
			token: req.params.token,
			expiracion: {
				[Op.gte]: Date.now(),
			},
		},
	});

	// verificamos que el usuario existe
	// si no hay usuario
	if (!usuario) {
		req.flash('error', 'No Válido');
		res.redirect('/restablecer');
	}

	// hashear el nuevo password

	usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	usuario.token = null;
	usuario.expiracion = null;

	await usuario.save();
	req.flash('correcto', 'Tu password se ha modificado correctamente');
	res.redirect('/iniciar-sesion');
};
