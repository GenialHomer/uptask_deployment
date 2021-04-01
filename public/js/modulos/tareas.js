import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
	tareas.addEventListener('click', (e) => {
		// console.log(e.target.classList);
		if (e.target.classList.contains('fa-check-circle')) {
			// console.log(`🚀 ~ file: tareas.js ~ line 2 ~ tareas`, 'actualizando');
			const icono = e.target;
			const idTarea = icono.parentElement.parentElement.dataset.tarea;
			// console.log(`🚀 => file: tareas.js => line 13 => tareas.addEventListener => idTarea`, idTarea);
			const url = `${location.origin}/tareas/${idTarea}`;
			// console.log(`🚀 => file: tareas.js => line 13 => tareas.addEventListener => url`, url);
			axios.patch(url, { idTarea }).then(function (respuesta) {
				// console.log(`🚀 => file: tareas.js => line 23 => .then => respuesta`, respuesta);
				if (respuesta.status === 200) {
					icono.classList.toggle('completo');
					actualizarAvance();
				}
			});
		}
		if (e.target.classList.contains('fa-trash')) {
			// console.log('eliminando');
			// console.log(e.target);
			const tareaHTML = e.target.parentElement.parentElement;
			const idTarea = tareaHTML.dataset.tarea;
			// console.log(`🚀 => file: tareas.js => line 29 => tareas.addEventListener => idTarea`, idTarea);
			// console.log(`🚀 => file: tareas.js => line 29 => tareas.addEventListener => tareaHTML`, tareaHTML);
			Swal.fire({
				title: 'Deseas borrar esta tarea?',
				text: 'Una tarea eliminada no se puede recuperar!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, Borrar!',
				cancelButtonText: 'No, Cancelar!',
			}).then((result) => {
				if (result.isConfirmed) {
					// console.log('confirmado');

					const url = `${location.origin}/tareas/${idTarea}`;
					// enviar el delete por medio de axios

					axios.delete(url, { params: { idTarea } }).then(function (respuesta) {
						// console.log(`🚀 => file: tareas.js => line 48 => .then => respuesta`, respuesta);
						if (respuesta.status === 200) {
							console.log(respuesta);

							// eliminar el node
							tareaHTML.parentElement.removeChild(tareaHTML);

							// opcional
							Swal.fire('Tarea Eliminada', respuesta.data, 'success');
						}
						actualizarAvance();
					});
				}
			});
		}
	});
}

export default tareas;
