$.getScript('auth.js', function() {
    function listarRemitentes() {
        obtenerToken().then(function(token) {
            $.ajax({
                url: "http://localhost:8080/remitente/listar",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                },
                success: function (datos) {
                    var tabla = document.getElementById("tablaDatos");
                    for (var i = 0; i < datos.length; i++) {
                        var dato = datos[i];
                        
                        var fila = tabla.insertRow();
    
                        var celdaIdRemitente = fila.insertCell(0);
                        celdaIdRemitente.innerHTML = dato.idRemitente;
    
                        var celdaNombreRemitente = fila.insertCell(1);
                        celdaNombreRemitente.innerHTML = dato.nombreRemitente;
    
                        var celdaDniRemitente = fila.insertCell(2);
                        celdaDniRemitente.innerHTML = dato.dniRemitente;
    
                        var celdaTelefono = fila.insertCell(3);
                        celdaTelefono.innerHTML = dato.telefono;
                    }
                }
            });
        });
    }
    
    $(document).ready(function () {
        listarRemitentes();
    });

  function crearRemitente() {
      obtenerToken().then(function(token) {
          var data = {
              nombreRemitente: $('#nombreRemitente').val(),
              dniRemitente: $('#dniRemitente').val(),
              telefono: $('#telefono').val()
          };
  
          $.ajax({
              url: "http://localhost:8080/remitente/registrar",
              method: "POST",
              data: JSON.stringify(data),
              contentType: "application/json",
              headers: {
                  "Authorization": "Bearer " + token
              },
              
              success: function (respuesta) {
                  console.log(respuesta);
                  parent.location.href = "registrar.html";
              },
              error: function (error) {
                  console.error(error);
  
              }
          });
      });
  }
  
  $('#form-remitente').on('submit', function(event) {
      event.preventDefault();
      crearRemitente();
  });

  function actualizarRemitente() {
    obtenerToken().then(function(token) {
        var data = {
            idRemitente: $('#idRemitente').val(),
            nombreRemitente: $('#nombreRemitente').val(),
            dniRemitente: $('#dniRemitente').val(),
            telefono: $('#telefono').val()
        };

        $.ajax({
            url: "http://localhost:8080/remitente/actualizar",
            method: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
            
            success: function (respuesta) {
                console.log(respuesta);
                parent.location.href = "listar.html";
            },
            error: function (error) {
                console.error(error);

            }
        });
    });
}

$('#form-editar-remitente').on('submit', function(event) {
    event.preventDefault();
    actualizarRemitente();
});


function eliminarRemitente() {
    obtenerToken().then(function(token) {
        var data = {
            idRemitente: $('#idRemitente').val()
        };

        $.ajax({
            url: "http://localhost:8080/remitente/eliminar",
            method: "DELETE",
            data: JSON.stringify(data),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
            
            success: function (respuesta) {
                console.log(respuesta);
                parent.location.href = "listar.html";
            },
            error: function (error) {
                console.error(error);

            }
        });
    });
}

$('#form-eliminar-remitente').on('submit', function(event) {
    event.preventDefault();
    eliminarRemitente();
});


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
    tabla += "<tr><th>Información</th><th>Datos</th></tr>";
    tabla += "<tr><td>Origen</td><td>" + envio.origen + "</td></tr>";
    tabla += "<tr><td>Destino</td><td>" + envio.destino + "</td></tr>";
    tabla += "<tr><td>Estado</td><td>" + envio.estado + "</td></tr>";
    tabla += "<tr><td>Observaciones</td><td>" + envio.observaciones + "</td></tr>";
    tabla += "<tr><td>Remitente</td><td>" + envio.remitente.nombreRemitente + "</td></tr>";
    tabla += "<tr><td>DNI Remitente</td><td>" + envio.remitente.dniRemitente + "</td></tr>";
    tabla += "<tr><td>Teléfono Remitente</td><td>" + envio.remitente.telefono + "</td></tr>";
    tabla += "<tr><td>Destinatario</td><td>" + envio.destinatario.nombreDestinatario + "</td></tr>";
    tabla += "<tr><td>Dirección Destinatario</td><td>" + envio.destinatario.direccion + "</td></tr>";
    tabla += "<tr><td>Teléfono Destinatario</td><td>" + envio.destinatario.telefono + "</td></tr>";
    tabla += "<tr><td>Peso del Paquete</td><td>" + envio.paquete.peso + "</td></tr>";
    tabla += "<tr><td>Medidas del Paquete</td><td>" + envio.paquete.medidas + "</td></tr>";
    tabla += "</table>";

    $('#contenedor-envio').html(tabla);
}

$(document).ready(function () {
    consultarEnvio();
});





});
