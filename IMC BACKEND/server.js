const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

let historial = [];

app.use(cors());
app.use(bodyParser.json());



// Ruta para guardar un cálculo
app.post("/imc", (req, res) => {
    const registro = req.body;
    historial.push(registro);
    res.json({ message: "Guardado correctamente" });
});

// Ruta para obtener historial
app.get("/historial", (req, res) => {
    res.json(historial);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
