const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Crear carpeta db/ si no existe (por si acaso)
const fs = require("fs");
const dbDir = path.join(__dirname, "db");
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Conectar a la base de datos SQLite
const dbPath = path.join(__dirname, "db", "imc.db");
const db = new sqlite3.Database(dbPath);

// Crear tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS historial (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        peso REAL,
        altura REAL,
        imc REAL,
        categoria TEXT
    )
`);

app.use(cors());
app.use(bodyParser.json());

// Ruta para guardar un cálculo
app.post("/imc", (req, res) => {
    const { peso, altura, imc, categoria } = req.body;

    const query = `INSERT INTO historial (peso, altura, imc, categoria) VALUES (?, ?, ?, ?)`;
    db.run(query, [peso, altura, imc, categoria], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al guardar en la base de datos" });
        }
        res.json({ message: "Guardado correctamente", id: this.lastID });
    });
});

// Ruta para obtener historial
app.get("/historial", (req, res) => {
    const query = `SELECT * FROM historial ORDER BY id DESC`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener historial" });
        }
        res.json(rows);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
