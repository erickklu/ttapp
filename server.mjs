import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  database: 'tt_biblio',
  user: 'root',
  password: '',
});

connection.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Conectado a la base de datos');
  }
});

app.get('/api/validar-cedula/:cedula', (req, res) => {
  const cedula = req.params.cedula;
  const query = 'SELECT * FROM estudiante WHERE es_cedu = ?';
  connection.query(query, [cedula], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al validar la cédula' });
    } else {
      if (results.length > 0) {
        const estudiante = {
          apellidos: results[0].es_ape,
          nombres: results[0].es_nom,
          cedula: results[0].es_cedu,
        };
        
        // La cédula existe en la base de datos
        res.json({ valid: true, data: estudiante });
      } else {
        // La cédula no existe en la base de datos
        res.json({ valid: false, data: null });
      }
    }
  });
});

app.get('/api/obtener-datos-estudiante/:cedula', (req, res) => {
  const cedula = req.params.cedula;
  const query = 'SELECT * FROM estudiante WHERE es_cedu = ?';
  connection.query(query, [cedula], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener datos del estudiante' });
    } else {
      if (results.length > 0) {

        // Si el estudiante fue encontrado en la base de datos
        const estudiante = results[0];
        res.json({ estudiante });

      } else {
        
        // Si el estudiante no es encontrado en la base de datos
        res.status(404).json({ error: 'Estudiante no encontrado' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
