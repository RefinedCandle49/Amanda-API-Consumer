$.getScript('auth.js', function() {

    function eliminarEnvio() {
        obtenerToken().then(function(token) {
            var data = {
                idGuia: $('#idEnvio').val()
            };

            $.ajax({
                url: "http://localhost:8080/envio/eliminar",
                method: "DELETE",
                data: JSON.stringify(data),
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token
                },

                success: function (respuesta) {
                    console.log(respuesta);
                    parent.location.href = "mostrarEnvio.html";
                },
                error: function (error) {
                    console.error(error);
                }
            });
        });
    }


    $(document).ready(function () {
        $('#eliminar').click(eliminarEnvio);
    });

    function actualizarEnvio() {
        obtenerToken().then(function (token) {
            var data = {
                idGuia: $('#idGuia').val(),
                origen: $('#origen').val(),
                destino: $('#destino').val(),
                estado: $('#estado').val(),
                observaciones: $('#observaciones').val(),
                remitente: {
                    nombreRemitente: $('#nombreRemitente').val(),
                    dniRemitente: $('#dniRemitente').val(),
                    telefono: $('#telefonoRemitente').val(),
                },
                destinatario: {
                    nombreDestinatario: $('#nombreDestinatario').val(),
                    direccion: $('#direccionDestinatario').val(),
                    telefono: $('#telefonoDestinatario').val()
                }

            };

            $.ajax({
                url: "http://localhost:8080/envio/actualizar",
                method: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token
                },

                success: function (respuesta) {
                    console.log(respuesta);
                    parent.location.href = "mostrarEnvio.html";
                },
                error: function (error) {
                    console.error(error);

                }
            });
        });
    }

    $('#form-editar-envio').on('submit', function (event) {
        event.preventDefault();
        actualizarEnvio();
    });


    function consultarEnvio() {
        $('#consultaForm').submit(function (event) {
            event.preventDefault();
            var idEnvio = $('#idEnvio').val();
            obtenerToken().then(function (token) {
                $.ajax({
                    url: "http://localhost:8080/envio/listar/" + idEnvio,
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    success: function (datos) {
                        mostrarDatosEnvio(datos[0]);
                    }
                });
            });
        });
    }

    function consultarDetalles() {
        $('#consultaForm').submit(function (event) {
            event.preventDefault();
            var idEnvio = $('#idEnvio').val();
            obtenerToken().then(function(token) {
                $.ajax({
                    url: "http://localhost:8080/detallepaquete/listar/" + idEnvio,
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    success: function (datos) {
                        mostrarDatosDetalle(datos);
                    }
                });
            });
        });
    }

    $(document).ready(function () {
        consultarDetalles();
    });

    function mostrarDatosDetalle(detallesPaquete) {
        var contenidoHTML = '';

        for (var i =  0; i < detallesPaquete.length; i++) {
            var detalle = detallesPaquete[i];

            // Crear un div para cada par de descripción y cantidad
            contenidoHTML += '<div class="row">';

            // Agregar el input y label para la descripción
            contenidoHTML += '<div class="col-md-6">';
            contenidoHTML += '<label for="descripcion-' + i + '" class="form-label">Descripción:</label>';
            contenidoHTML += '<input type="text" class="form-control" id="descripcion-' + i + '" value="' + detalle.descripcion + '" disabled />';
            contenidoHTML += '</div>';

            // Agregar el input y label para la cantidad
            contenidoHTML += '<div class="col-md-6">';
            contenidoHTML += '<label for="cantidad-' + i + '" class="form-label">Cantidad:</label>';
            contenidoHTML += '<input type="number" class="form-control" id="cantidad-' + i + '" value="' + detalle.cantidad + '" disabled />';
            contenidoHTML += '</div>';

            contenidoHTML += '</div>'; // Cierre del div row
        }

        // Reemplazar el contenido del div con id 'contenedor-detalle-paquete' con el nuevo HTML
        $('#contenedor-detalle-paquete').html(contenidoHTML);
    }


    function mostrarDatosEnvio(datos) {
        $('#idGuia').val(datos.idGuia);
        $('#origen').val(datos.origen);
        $('#destino').val(datos.destino);
        $('#estado').val(datos.estado);
        $('#observaciones').val(datos.observaciones || '');
        $('#idRemitente').val(datos.remitente.idRemitente);
        $('#nombreRemitente').val(datos.remitente.nombreRemitente);
        $('#dniRemitente').val(datos.remitente.dniRemitente);
        $('#telefonoRemitente').val(datos.remitente.telefono);
        $('#idDestinatario').val(datos.destinatario.idDestinatario);
        $('#nombreDestinatario').val(datos.destinatario.nombreDestinatario);
        $('#direccionDestinatario').val(datos.destinatario.direccion);
        $('#telefonoDestinatario').val(datos.destinatario.telefono);
        $('#idPaquete').val(datos.paquete.idPaquete);
        $('#pesoPaquete').val(datos.paquete.peso);
        $('#medidasPaquete').val(datos.paquete.medidas);
    }


    $(document).ready(function () {
        // Llama a la función consultarEnvio cuando se cargue la página
        consultarEnvio();
    });





    // Función para crear el envío
    function crearEnvio() {
        obtenerToken().then(function(token) {
            // Recoger todos los detalles del paquete
            var detallePaquete = [];
            $('.detallePaqueteItem').each(function() {
                var descripcion = $(this).find('input[name^="descripcion"]').val();
                var cantidad = $(this).find('input[name^="cantidad"]').val();
                detallePaquete.push({ descripcion: descripcion, cantidad: cantidad });
            });

            var data = {
                origen: $('#origen').val(),
                destino: $('#destino').val(),
                estado: $('#estado').val(),
                observaciones: $('#observaciones').val(),
                remitente: {
                    nombreRemitente: $('#nombreRemitente').val(),
                    dniRemitente: $('#dniRemitente').val(),
                    telefono: $('#telefonoRemitente').val()
                },
                destinatario: {
                    nombreDestinatario: $('#nombreDestinatario').val(),
                    direccion: $('#direccionDestinatario').val(),
                    telefono: $('#telefonoDestinatario').val()
                },
                paquete: {
                    peso: $('#peso').val(),
                    medidas: $('#medidas').val()
                },
                detallePaquete: detallePaquete // Usamos el array recogido anteriormente
            };

            $.ajax({
                url: "http://localhost:8080/envio/registrar",
                method: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + token
                },
                success: function(respuesta) {
                    console.log(respuesta);
                    // Redirigimos al usuario a la página de registro exitoso
                    window.location.href = "registrar.html";
                },
                error: function(error) {
                    console.error(error);
                }
            });
        }).catch(function(error) {
            console.error("Error al obtener el token:", error);
        });
    }

    // Evento para el envío del formulario
    $('#form-envio').on('submit', function(event) {
        event.preventDefault();
        crearEnvio();
    });

    // Función para agregar un nuevo campo de detalle del paquete
function agregarDetalle() {
    var container = $('#detallePaqueteContainer');
    var index = container.children('.detallePaqueteItem').length;

    var newDetail = $('<div class="detallePaqueteItem row">')
        .append($('<div class="col-md-6">')
            .append($('<label for="descripcion' + index + '" class="form-label">Descripción:</label>'))
            .append($('<input type="text" required class="form-control" maxlength="255" id="descripcion' + index + '" name="descripcion' + index + '">')))
        .append($('<div class="col-md-6">')
            .append($('<label for="cantidad' + index + '" class="form-label">Cantidad:</label>'))
            .append($('<input type="text" required class="form-control" pattern="[0-9]{1,}" title="Caracteres admitidos 0-9" min="0" id="cantidad' + index + '" name="cantidad' + index + '">')));


    container.append(newDetail);
}

$('#agregarDetalle').click(function() {
    agregarDetalle();
});

function eliminarUltimoDetalle() {
    var container = $('#detallePaqueteContainer');
    if (container.children('.detallePaqueteItem').length >  1) {
        container.children('.detallePaqueteItem').last().remove();
    } else {
        alert('Debes agregar al menos un detalle.');
    }
}

$('#eliminarDetalle').click(function() {
    eliminarUltimoDetalle();
});

});
