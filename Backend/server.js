const express = require('express');

const app = express();

let port = 3001;

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto", port)
}); 

app.get('/saludar', (req, res) => {
    console.log("Recibimos una solicitud!");
    res.send("Hola desde mi primer api!");
});