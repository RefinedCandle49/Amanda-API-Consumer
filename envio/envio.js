$(document).ready(function() {
    // Función para agregar un nuevo conjunto de campos de detalle del paquete
    function agregarDetalle() {
        var index = $('.detallePaqueteItem').length;
        var newDetail = '<div class="detallePaqueteItem">' +
                            '<label for="descripcion' + (index +  1) + '">Descripción:</label><br>' +
                            '<input type="text" id="descripcion' + (index +  1) + '" name="descripcion[]"><br>' +
                            '<label for="cantidad' + (index +  1) + '">Cantidad:</label><br>' +
                            '<input type="number" id="cantidad' + (index +  1) + '" name="cantidad[]"><br>' +
                        '</div>';
        $('#detallePaqueteContainer').append(newDetail);
    }

    // Evento para agregar un nuevo detalle del paquete
    $('#agregarDetalle').click(function() {
        agregarDetalle();
    });

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
                detallePaquete: [
                    {
                        descripcion: $('#descripcion').val(),
                        cantidad: $('#cantidad').val()
                    }
                ]
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
});
