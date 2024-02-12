$(document).ready(function() {

    // Evento para agregar un nuevo detalle del paquete
    

    // Función para obtener el token de autenticación
    function obtenerToken() {
        return new Promise(function(resolve, reject) {
            $.ajax({
                url: "http://localhost:8080/usuario/autenticar",
                method: "POST",
                data: JSON.stringify({
                    username: "Kevin",
                    password: "12345"
                }),
                contentType: "application/json",
                
                success: function (token) {
                    resolve(token);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }

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
