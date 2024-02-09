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
