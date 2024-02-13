$.getScript('auth.js', function() {
    function actualizarEnvio() {
        obtenerToken().then(function (token) {
            var data = {
                idGuia: $('#idGuia').val(),
                origen: $('#origen').val(),
                destino: $('#destino').val(),
                estado: $('#estado').val(),
                observaciones: $('#observaciones').val()
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
        var tabla = "<table id='tablaDatos'>";
        tabla += "<tr><th>Descripción</th><th>Cantidad</th></tr>";

        for (var i =  0; i < detallesPaquete.length; i++) {
            var detalle = detallesPaquete[i];
            tabla += "<tr>";
            tabla += "<td>" + detalle.descripcion + "</td>";
            tabla += "<td>" + detalle.cantidad + "</td>";
            tabla += "</tr>";
        }

        tabla += "</table>";
        $('#contenedor-detalle-paquete').html(tabla);
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

    var newDetail = $('<div class="detallePaqueteItem">')
        .append($('<label for="descripcion' + index + '">Descripción:</label><br>'))
        .append($('<input type="text" id="descripcion' + index + '" name="descripcion' + index + '"><br>'))
        .append($('<label for="cantidad' + index + '">Cantidad:</label><br>'))
        .append($('<input type="number" id="cantidad' + index + '" name="cantidad' + index + '"><br>'));

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
