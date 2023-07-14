// Server-side JavaScript
const express = require('express');
const app = express();
const port = 3000; // Port for server hosting (can be any unused port)
const mqtt = require('mqtt'); // Get MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com'); // Connect to broker to receive incoming messages

app.use(express.static('public')); // File path for access to HTML, CSS and client-side JavaScript

// Listens for any connections to the specified port
app.listen(port, () => {
    console.log(`MQTT Server listening at http://localhost:${port}/`);
});

// All events are checked here
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('Test');
});

const clients = [];

app.get('/api/long-polling', (req, res) => {
  // Store the client response object
  clients.push(res);

  // For client disconnection
  res.on('close', () => {
    const index = clients.indexOf(res);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

  // Activate clients
  client.on('message', (topic, message) => {
    setTimeout(() => {
        let data = message.toString();
        // Send the response to all connected clients
        clients.forEach(client => {
        client.json(data);
        console.log(`Received message from ${topic}: ${message}`);
        });

        // Clear data sent to client to allow for more requests
        clients.length = 0;
        }, 1000); // Simulate async behaviour by delaying next message retrieval from MQTT
    });
});