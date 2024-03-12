let ipAddress = '';
ipAddress = window.location.href.split('https://')[1];
console.log('ipAddressBefore', ipAddress);
document.addEventListener('DOMContentLoaded', () => {
  // const ipAddress = electronAPI.getLocalIpAddress();

  // console.log('getLocalIpAdd', electronAPI.getLocalIpAddress(), window.location.href.split('http://')[1])
if( ipAddress === undefined){
  ipAddress = electronAPI.getLocalIpAddress() + ':443';
}
 console.log('ipAdd', ipAddress)
  const ws = new WebSocket('wss://' + ipAddress);
ws.onopen = function() {
    console.log('WebSocket Client Connected');
    // Now that the connection is open, it's safe to send messages
    const payload = { 
      tipo: 'message',
      message: 'Hi this is web client.'
    };
    ws.send(JSON.stringify(payload));

    // If you need to send messages in response to user actions (like mouse movements),
    // those event listeners should ideally be set up here to ensure they only try to send
    // messages after the WebSocket connection is open. However, for continuous events like
    // mouse movement, you'll need a different approach to handle the still-connecting state.
};

// To handle continuous events like mouse movements, you can create a function that checks
// if the WebSocket is in the OPEN state before sending a message. If not, it could either
// queue the messages to send later or simply drop them.
function safeSend(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
    } else {
        console.log('WebSocket is not open. ReadyState:', ws.readyState);
        // Optionally, queue the data or handle this case as needed.
    }
}

document.addEventListener('mousemove', function(event) {
    const payload = { 
      tipo: 'MousePos', 
      x: event.clientX, 
      y: event.clientY 
    };

    safeSend(ws, JSON.stringify(payload));
});

document.addEventListener('click', function(event) {
  const payload = { 
    tipo: 'Click', 
    x: event.clientX, 
    y: event.clientY 
  };

  // Use safeSend instead of ws.send directly
  safeSend(ws, JSON.stringify(payload));
});

if (window.DeviceOrientationEvent) {
  console.log('Gyroscope supported by the browser/device.')
  document.getElementById("messages").innerText +="Gyroscope supported by the browser/device " ;
  window.addEventListener('deviceomotion', function(event) {
    document.getElementById("messages").innerText +="Gyroscope supported by the browser/device " + event;
    console.log(`deviceomotion=${event.acceleration.x}`);
      const payload = { 
        tipo: 'Gyroscope',
        alpha: event.alpha, // Represents the motion of the device around the z axis, from 0 to 360 degrees
        beta: event.beta,  // Represents the motion of the device around the x axis, from -180 to 180 degrees. This represents a front to back motion of the device.
        gamma: event.gamma // Represents the motion of the device around the y axis, from -90 to 90 degrees. This represents a left to right motion of the device.
      };
      document.getElementById("messages").innerText += `Gyroscope received: alpha=${event.alpha}, beta=${event.beta}, gamma=${event.gamma}`;

      console.log(`Gyroscope received: alpha=${event.alpha}, beta=${event.beta}, gamma=${event.gamma}`);
      // Send the orientation data as a string to the server
      safeSend(ws, JSON.stringify(payload));
  }, true);
} else {
  console.log('Gyroscope not supported by the browser/device.');
}

if (window.DeviceMotionEvent) {
  console.log('Accelerometer supported by the browser/device.')
  window.addEventListener("devicemotion", (event) => {
    console.log(`${event} m/s2`);
    document.getElementById("messages").innerText += "Acceleration received:"+ event.acceleration.x + "\n";
  });
  try {
    const accelerometer = new Accelerometer({frequency: 60});

    accelerometer.addEventListener('reading', e => {
      console.log(`Acceleration along the X-axis ${accelerometer.x}`);
      console.log(`Acceleration along the Y-axis ${accelerometer.y}`);
      console.log(`Acceleration along the Z-axis ${accelerometer.z}`);
      const payload = {
        tipo: 'Accelerometer', 
        x: accelerometer.x, 
        y: accelerometer.y, 
        z: accelerometer.z 
      }

      document.getElementById("messages").innerText += `Acceleration received: x=${payload.x}, y=${payload.y}, z=${payload.z}`+ "\n";

      safeSend(ws, JSON.stringify(payload));
    });

    accelerometer.start();

    // Send the orientation data as a string to the server
   
  } catch (error) {
    console.error('Accelerometer initialization error:', error);
  }
} else {
  console.log('Accelerometer not supported by the browser.');
}

ws.onmessage = function(event) {
  try {
    const data = JSON.parse(event.data); // Correct parsing of the received message
    console.log(`Message received:`, data);
    switch (data.tipo) {
      case 'message': if(data.message) {
        console.log(`Message: ${data.message}`)
        document.getElementById("messages").innerText += "Message:" + data.message + "\n";
      }          
          break;
  
      case 'MousePos':  if (data.x && data.y) {
          console.log(`Mouse position: x=${data.x}, y=${data.y}`);
          document.getElementById("messages").innerText += "MousePos, X:" + data.x +", "+ "Y:" + data.y + "\n";
          if(!electronAPI){
            electronAPI.moveCursorTo(data.x, data.y);
          }
        }          
          break;

      case 'Click':  if (data.x && data.y) {
          console.log(`Mouse Click: x=${data.x}, y=${data.y}`);
          document.getElementById("messages").innerText += "Click, X:" + data.x +", "+ "Y:" + data.y + "\n";
          if(electronAPI !== undefined){
             electronAPI.clickIn(data.x, data.y);
           }
        }            
          break;

      case 'Gyroscope': if (data.alpha && data.beta && data.gamma) {
          console.log(`Gyroscope data: alpha=${data.alpha}, beta=${data.beta}, gamma=${data.gamma}`);
          document.getElementById("messages").innerText += "Gyroscope, alpha:" + data.alpha +", "+ "beta:" + data.beta + "gamma:" + data.gamma + "\n";
        }
          
          break;
           
      case 'Accelerometer': if (data.x && data.y && data.z) {
          console.log(`Accelerometer data: X=${data.x}, Y=${data.y}, Z=${data.z}`);
          document.getElementById("messages").innerText += "Accelerometer, X:" + data.x +", "+ "Y:" + data.y + "Z:" + data.z + "\n";

        }
          
          break;
                        
      default: 
          break;
  }
  } catch(e) {
    console.log('Error:', e);
  }
    // Display the received message somewhere in your HTML
    // document.getElementById("messages").innerText += e.data + "\n";
};

ws.onclose = function(e) {
    console.log('Client disconnected');
};

});