const express = require('express');
const app = express();
const sendMailHandler = require('./api/sendMail');
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    origin: 'https://www.tarvyainfra.com'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running properly!');
});


app.all('/api/sendMail', (req, res) => {
    sendMailHandler(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    Server is running!

    Port:   ${PORT}
    URL:    http://localhost:${PORT}/api/sendMail
    Method: POST

    `);
});

module.exports = app;
