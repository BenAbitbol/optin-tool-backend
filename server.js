const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://parroquies-andorre.myshopify.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

const databaseUrl = process.env.DATABASE_URL;
let pool = null;
const fallbackEmails = [];

if (databaseUrl) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool
    .query(`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL
      );
    `)
    .catch(err => console.error('Erreur lors de la création de la table', err));
} else {
  console.warn('DATABASE_URL non défini : les emails seront stockés en mémoire.');
}

app.post('/api/emails', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email manquant !' });
  }

  if (!pool) {
    fallbackEmails.push({ email, receivedAt: new Date().toISOString() });
    return res.json({ message: 'Email reçu (stockage temporaire).' });
  }

  try {
    await pool.query('INSERT INTO emails (email) VALUES ($1)', [email]);
    res.json({ message: 'Email reçu et stocké avec succès !' });
  } catch (err) {
    console.error("Erreur lors de l'insertion de l'email", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
