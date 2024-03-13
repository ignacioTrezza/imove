const { contextBridge, ipcRenderer } = require('electron');
const os = require('os'); // Import the os module
const qrcode = require('qrcode');

contextBridge.exposeInMainWorld('electronAPI', {
  moveCursorTo: (x, y) => ipcRenderer.send('move-cursor', { x, y }),
  clickIn: (x, y) => ipcRenderer.send('click-mouse', { x, y }),
  other:()=>{ipcRenderer.on('qr-code', (event, url) => {
    // Create an image element to display the QR code
    const img = document.createElement('img');
    img.src = url;
    document.body.appendChild(img); // Assuming you want to append to the body
  });},
  getLocalIpAddress: () => getLocalIpAddress(),
}),



// Function to get the local IP address
function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const interface of networkInterface) {
      if (!interface.internal && interface.family === 'IPv4') {
        return interface.address;
      }
    }
  }
  return '127.0.0.1'; // Return localhost if no external IP found
}


window.addEventListener('DOMContentLoaded', () => {
  
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  qrcode.toDataURL(getLocalIpAddress() + ':443', (err, url) => {
    if (err) console.error(err);
    else {
      console.log('url', url)
   // Create an image element to display the QR code
   const img = document.createElement('img');
   img.src = url;
   document.body.appendChild(img); // Assuming you want to append to the body
    }
  });
  // Listen for the mouse position response from the main process
// ipcRenderer.on('mouse-pos-response', (event, { x, y }) => {
//   console.log(`Mouse Position Received (X:${x}, Y:${y})`);
//   // You can now use this position in your renderer process
//   // For example, you might want to display it or use it in some calculations.
//   // Note: You'll need to implement a way to use this data in your application, such as calling a function or emitting a custom event with this data.
// });
})