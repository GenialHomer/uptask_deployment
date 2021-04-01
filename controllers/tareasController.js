const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
	// res.send('enviado');
	// obtenemos el proyecto actual
	const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

	// console.log(`proyecto`, proyecto);
	// console.log(`req.body`, req.body);

	// leer el valor del input
	const { tarea } = req.body;

	// estado 0 = incompleto y ID del Proyecto
	const estado = 0;
	const proyectoId = proyecto.id;

	// insertar en la DB
	const resultado = await Tareas.create({ tarea, estado, proyectoId });

	if (!resultado) {
		return next();
	}
	// redireccionar
	res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res) => {
	// console.log(req.params);
	const { id } = req.params;
	const tarea = await Tareas.findOne({ where: { id: id } });
	// console.log(`🚀 => file: tareasController.js => line 34 => tarea`, tarea);

	// cambiar el estado
	let estado = 0;
	if (tarea.estado === estado) {
		estado = 1;
	}
	tarea.estado = estado;

	const resultado = await tarea.save();
	if (!resultado) return next();

	res.status(200).send('todo bien');
};

exports.eliminarTarea = async (req, res) => {
	// console.log(req.params);
	const { id } = req.params;

	// eliminar tarea
	const resultado = await Tareas.destroy({ where: { id } });

	if (!resultado) return next();
	res.status(200).send('Tarea Eliminada Correctamente');
};
