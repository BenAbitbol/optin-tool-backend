const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour autoriser uniquement les requêtes provenant de Shopify
const corsOptions = {
  origin: 'https://parroquies-andorre.myshopify.com',  // Remplace par ton domaine exact
  optionsSuccessStatus: 200 // Pour gérer les navigateurs plus anciens
};

app.use(cors(corsOptions));

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
