const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importer le client PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour Shopify
const corsOptions = {
  origin: 'https://parroquies-andorre.myshopify.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204
};

// Middleware CORS
app.use(cors(corsOptions));
app.use(express.json());

// Connexion à PostgreSQL avec les informations de Heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Créer la table pour stocker les emails (si elle n'existe pas)
pool.query(`
  CREATE TABLE IF NOT EXISTS emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL
  );
`).catch(err => console.error('Erreur lors de la création de la table', err));

// Route POST pour recevoir les emails et les stocker dans la base de données
app.post('/api/emails', async (req, res) => {
  const { email } = req.body;
  if (email) {
    try {
      await pool.query('INSERT INTO emails (email) VALUES ($1)', [email]);
      res.json({ message: 'Email reçu et stocké avec succès !' });
    } catch (err) {
      console.error('Erreur lors de l\'insertion de l\'email', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(400).json({ message: 'Email manquant !' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
