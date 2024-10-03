const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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
