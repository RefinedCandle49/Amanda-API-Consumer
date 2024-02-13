$.getScript('auth.js', function() {



    function consultarEnvio() {
        $('#consultaForm').submit(function (event) {
            event.preventDefault();
            var idEnvio = $('#idEnvio').val();
            obtenerToken().then(function(token) {
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

    function mostrarDatosEnvio(envio) {
        var tabla = "<table>";

        tabla += "<tr><td>Número de rastreo</td><td><input type='text' value='" + envio.idGuia + "'></td></tr>";
        tabla += "<tr><td>Origen</td><td><input type='text' value='" + envio.origen + "'></td></tr>";
        tabla += "<tr><td>Destino</td><td><input type='text' value='" + envio.destino + "'></td></tr>";
        tabla += "<tr><td>Estado</td><td><input type='text' value='" + envio.estado + "'></td></tr>";
        tabla += "<tr><td>Observaciones</td><td><input type='text' value='" + envio.observaciones + "'></td></tr>";
        tabla += "<tr><td>ID Remitente</td><td><input type='text' value='" + envio.remitente.idRemitente + "'></td></tr>";
        tabla += "<tr><td>Remitente</td><td><input type='text' value='" + envio.remitente.nombreRemitente + "'></td></tr>";
        tabla += "<tr><td>DNI Remitente</td><td><input type='text' value='" + envio.remitente.dniRemitente + "'></td></tr>";
        tabla += "<tr><td>Teléfono Remitente</td><td><input type='text' value='" + envio.remitente.telefono + "'></td></tr>";
        tabla += "<tr><td>ID Destinatario</td><td><input type='text' value='" + envio.destinatario.idDestinatario + "'></td></tr>";
        tabla += "<tr><td>Destinatario</td><td><input type='text' value='" + envio.destinatario.nombreDestinatario + "'></td></tr>";
        tabla += "<tr><td>Dirección Destinatario</td><td><input type='text' value='" + envio.destinatario.direccion + "'></td></tr>";
        tabla += "<tr><td>Teléfono Destinatario</td><td><input type='text' value='" + envio.destinatario.telefono + "'></td></tr>";
        tabla += "<tr><td>ID Paquete</td><td><input type='text' value='" + envio.paquete.idPaquete + "'></td></tr>";
        tabla += "<tr><td>Peso del Paquete</td><td><input type='text' value='" + envio.paquete.peso + "'></td></tr>";
        tabla += "<tr><td>Medidas del Paquete</td><td><input type='text' value='" + envio.paquete.medidas + "'></td></tr>";

        $('#contenedor-envio').html(tabla);
    }

    $(document).ready(function () {
        consultarEnvio();
    });

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
        $('#contenedor-detalle').html(tabla);
    }

    $(document).ready(function () {
        consultarDetalles();
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
