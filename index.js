const express = require('express');
const app = express();
const sendMailHandler = require('./api/sendMail');
const cors = require('cors');
require('dotenv').config();
const net = require('net');

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running properly!');
});


app.all('/api/sendMail', (req, res) => {
    sendMailHandler(req, res);
});

app.get('/api/smtpCheck', async (req, res) => {
    const host = 'smtp.gmail.com';
    const probe = (port, timeout = 5000) => new Promise((resolve) => {
        const socket = new net.Socket();
        let done = false;
        const finish = (status, error) => {
            if (done) return;
            done = true;
            try { socket.destroy(); } catch {}
            resolve({ port, status, error });
        };
        socket.setTimeout(timeout);
        socket.once('connect', () => finish('reachable'));
        socket.once('timeout', () => finish('timeout', 'ETIMEDOUT'));
        socket.once('error', (err) => finish('error', err && err.code ? err.code : String(err)));
        socket.connect(port, host);
    });
    const results = await Promise.all([probe(465), probe(587)]);
    res.json({ host, results });
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
