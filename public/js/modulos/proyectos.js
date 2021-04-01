import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
	btnEliminar.addEventListener('click', (e) => {
		// console.log('diste click en eliminar');
		const urlProyecto = e.target.dataset.proyectoUrl;
		// console.log(`urlProyecto`, urlProyecto);
		// return;
		Swal.fire({
			title: 'Deseas borrar este proyecto?',
			text: 'Un proyecto eliminado no se puede recuperar!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, Borrar!',
			cancelButtonText: 'No, Cancelar!',
		}).then((result) => {
			if (result.isConfirmed) {
				// enviar peticion a axios
				const url = `${location.origin}/proyectos/${urlProyecto}`;
				// console.log(`url`, url);
				// return;
				axios
					.delete(url, { params: { urlProyecto } })
					.then(function (respuesta) {
						// console.log(`respuesta`, respuesta);
						// return;
						Swal.fire('Proyecto Eliminado', respuesta.data, 'success');

						// Redireccionar al inicio
						setTimeout(() => {
							window.location.href = '/';
						}, 3000);
					})
					.catch(() => {
						Swal.fire({
							type: 'error',
							title: 'Hubo un error',
							text: 'no se puede eliminar el proyecto',
						});
						return;
					});
			}
		});
	});
}

export default btnEliminar;
