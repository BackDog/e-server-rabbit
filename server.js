'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const socketsStatus = {};

wss.on('connection', (ws) => {
    const socketId = ws.id;
    socketsStatus[ws.id] = {};
  
    console.log('Client connected');
  
    ws.on('message', function(message) {
        var data = JSON.parse(message);
      
        if (data.emit === "voice") {
          
          var newData = data.split(";");
          newData[0] = "data:audio/ogg;";
          newData = newData[0] + newData[1];
          wss.clients.forEach((client) => {
              client.send(JSON.stringify({emit:"send",data:newData}));
          });
        }else if (data.emit === "userInformation") {
          socketsStatus[socketId] = data.data;
          ws.send(JSON.stringify({emit:"usersUpdate",data:socketsStatus}));
        }
    });
  
    ws.on('close', () => function () {
      delete socketsStatus[socketId];
    });
});
