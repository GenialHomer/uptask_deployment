const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
	console.log(res.locals.usuario);

	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId,
		},
	});
	res.render('index', {
		nombrePagina: 'Proyectos',
		proyectos,
	});
};

exports.formularioProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId,
		},
	});
	res.render('nuevoProyecto', {
		nombrePagina: 'Nuevo Proyecto',
		proyectos,
	});
};

exports.nuevoProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId,
		},
	});
	// res.send('enviaste el formulario');
	// enviar  a la consola lo que el usuario escriba
	// console.log(req.body);

	// validar que tengamos algo en el input
	const { nombre } = req.body;

	let errores = [];
	if (!nombre) {
		errores.push({ texto: 'Agrega un Nombre al Proyecto' });
	}

	// si hay errores
	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos,
		});
	} else {
		// no hay errores
		// insertar en la db
		const usuarioId = res.locals.usuario.id;
		await Proyectos.create({ nombre, usuarioId });
		res.redirect('/');
	}
};

exports.proyectoPorUrl = async (req, res, next) => {
	const usuarioId = res.locals.usuario.id;
	const proyectosPromise = Proyectos.findAll({
		where: {
			usuarioId,
		},
	});

	// const proyectosPromise = Proyectos.findAll();

	const proyectoPromise = Proyectos.findOne({
		where: {
			url: req.params.url,
			usuarioId,
		},
	});

	const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

	// consultar tareas del proyecto actual
	const tareas = await Tareas.findAll({
		where: {
			proyectoId: proyecto.id,
		},
		include: [
			{
				model: Proyectos,
			},
		],
	});
	if (!proyecto) return next();

	// console.log(`proyecto`, proyecto);
	// res.send('OK');

	// render de la vista
	res.render('tareas', {
		nombrePagina: 'Tareas del Proyecto',
		proyecto,
		proyectos,
		tareas,
	});
};

exports.formularioEditar = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectosPromise = Proyectos.findAll({
		where: {
			usuarioId,
		},
	});

	// const proyectosPromise = Proyectos.findAll();

	const proyectoPromise = Proyectos.findOne({
		where: {
			id: req.params.id,
			usuarioId,
		},
	});

	const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

	// render a la vista
	res.render('nuevoProyecto', {
		nombrePagina: 'Editar Proyecto',
		proyectos,
		proyecto,
	});
};
exports.actualizarProyecto = async (req, res) => {
	const usuarioId = res.locals.usuario.id;
	const proyectos = await Proyectos.findAll({
		where: {
			usuarioId,
		},
	});

	// const proyectos = await Proyectos.findAll();
	// res.send('enviaste el formulario');
	// enviar  a la consola lo que el usuario escriba
	// console.log(req.body);

	// validar que tengamos algo en el input
	const { nombre } = req.body;

	let errores = [];
	if (!nombre) {
		errores.push({ texto: 'Agrega un Nombre al Proyecto' });
	}

	// si hay errores
	if (errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos,
		});
	} else {
		// no hay errores
		// insertar en la db
		await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
		res.redirect('/');
	}
};

exports.eliminarProyecto = async (req, res, next) => {
	// console.log(req);
	const { urlProyecto } = req.query;
	const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });
	if (!resultado) {
		return next();
	}
	res.status(200).send(`Proyecto <strong>${urlProyecto}</strong> Eliminado`);
};
