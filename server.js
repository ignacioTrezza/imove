const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws'); // Import the WebSocket library

const app = express();
const options = {
  key: fs.readFileSync(path.join(__dirname, 'assets/certificados', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'assets/certificados', 'cert.pem'))
};
const server = https.createServer(options, app).listen(443, () => {
  console.log('Server listening on port 443');
});
// const server = require('http').createServer(app); // Create an HTTP server

const wss = new WebSocket.Server({ server }); // Attach WebSocket server to the HTTP server

// Serve the PUBLIC folder on the /home route
app.use('/', express.static(path.join(__dirname, 'PUBLIC/dist/client/browser')));

// WebSocket connection setup
wss.on('connection', function connection(ws) {
    // console.log('OnConnection:', ws)
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
    //   console.log(`Recibo message: data.tipo=${data.tipo}, data.message=${data.message}, data.x=${data.x}, data.y=${data.y}, data.z=${data.z}, data.alpha=${data.alpha}`);
        switch (data.tipo) {
            case 'message': if(data.message) console.log(`Message: ${data.message}`)
                
                break;
        
            case 'MousePos':  if (data.x && data.y) {
                console.log(`Mouse position: x=${data.x}, y=${data.y}`);
              }
                
                break;

            case 'Gyroscope': if (data.alpha && data.beta && data.gamma) {
                // console.log(`Gyroscope data: alpha=${data.alpha}, beta=${data.beta}, gamma=${data.gamma}`);
              }
                
                break;
                 
            case 'Accelerometer': if (data.x && data.y && data.z) {
                // console.log(`Accelerometer data: X=${data.x}, Y=${data.y}, Z=${data.z}`);
              }
                
                break;

            case 'AccelerometerIncludingGravity': if (data.x && data.y && data.z) {
                console.log(`Accelerometer Including Gravity data: X=${data.x}, Y=${data.y}, Z=${data.z}`);
              }
              
              break;
                              
            default: 
                break;
        }
    
    } catch (e) {
      console.log('error received: %s', message);
    }
    // Broadcast incoming message to all clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        
        const payload = JSON.parse(message) 
        // console.log('sENDING mESSAGE',JSON.stringify(payload));
        // client.send(JSON.stringify(message));
        client.send(JSON.stringify(payload));
        }
    });
  });
  const payload = { 
    tipo: 'message',
    message: 'Hello! Message from server.'
  }
  ws.send(JSON.stringify(payload));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'PUBLIC/dist/client/browser/index.html')); // Ensure this points to your actual index.html file
});



module.exports = {  };
