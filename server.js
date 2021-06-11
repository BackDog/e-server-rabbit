'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

var CLIENTS=[];
wss.on('connection', function connection(ws) {
    CLIENTS.push(ws);
    ws.on('message', function incoming(message) {
        sendAll(message);
    });
});


setInterval(() => {
  wss.clients.forEach((client) => {
    client.send('PING:' + Date.now());
  });
}, 1000);

function sendAll (message) {
    for (var i=0; i<CLIENTS.length; i++) {
        CLIENTS[i].send(message);
    }
}
