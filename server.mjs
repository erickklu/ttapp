import fs from "fs";
import express from "express";
import cors from "cors";
 
const app = express();
const port = 3000;

app.use(cors());

// Leer el archivo JSON
fs.readFile("data/estudiantes.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const obj = JSON.parse(data);

  app.get("/api/validar-cedula/:cedula", (req, res) => {
    const cedula = req.params.cedula;

    // Convertir la cédula a un número
    const cedulaNum = Number(cedula);

    const results = obj.estudiantes.filter(
      (estudiante) => estudiante.es_cedu === cedulaNum
    );
    if (results.length > 0) {
      const estudiante = {
        apellidos: results[0].es_apel,
        nombres: results[0].es_nomb,
        cedula: results[0].es_cedu,
      };

      // Si la cédula ingresada existe en el archivo JSON
      res.json({ valid: true, data: estudiante });
    } else {
      // Si la cédula ingresada no existe en el archivo JSON
      res.json({ valid: false, data: null });
    }
  });

  
  app.get("/api/obtener-datos-estudiante/:cedula", (req, res) => {
    const cedula = req.params.cedula;

    // Convertir la cédula a un número
    const cedulaNum = Number(cedula);

    const results = obj.estudiantes.filter(
      (estudiante) => estudiante.es_cedu === cedulaNum
    );
    if (results.length > 0) {

      // Si el número de cédula fue encontrado en el archivo JSON
      const estudiante = results[0];
      res.json({ estudiante });
    } else {
      // Si el número de cédula no fue encontrado en el archivo JSON
      res.status(404).json({ error: "Estudiante no encontrado" });
    }
  });

  app.listen(port, () => {
    console.log(`Backend running on http://192.168.1.3:${port}`);
  });
});