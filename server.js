const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour autoriser uniquement Shopify
const corsOptions = {
  origin: 'https://parroquies-andorre.myshopify.com', // Remplace par ton domaine Shopify
  methods: ['GET', 'POST', 'OPTIONS'], // Autorise les méthodes GET, POST et OPTIONS
  allowedHeaders: ['Content-Type'], // Autorise l'en-tête 'Content-Type'
  optionsSuccessStatus: 200 // Pour compenser les navigateurs plus anciens
};

// Middleware pour CORS
app.use(cors(corsOptions));

// Gérer les requêtes préflight OPTIONS
app.options('*', cors(corsOptions)); // Active CORS pour toutes les requêtes OPTIONS

// Middleware pour parser le JSON
app.use(express.json());

// Route POST pour recevoir les emails
app.post('/api/emails', (req, res) => {
  const { email } = req.body;
  if (email) {
    console.log('Email reçu :', email);
    res.json({ message: 'Email reçu avec succès !' });
  } else {
    res.status(400).json({ message: 'Email manquant !' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
