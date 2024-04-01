const { contextBridge, ipcRenderer } = require('electron');
const os = require('os'); // Import the os module
const qrcode = require('qrcode');

contextBridge.exposeInMainWorld('electronAPI', {
  moveCursorTo: (x, y) => ipcRenderer.send('move-cursor', { x, y }),
  clickIn: (event) => ipcRenderer.send('click-mouse', event),

  qrMagic: (url) => {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(url + ':443', (err, dataUrl) => {
        if (err) reject(err);
        else resolve(dataUrl);
      });
    });
  },
  qrWifi: () => {
    ipcRenderer.on('qr-code-wifi', (event, url) => {
      qrcode.toDataURL(localIpAddress + ':443', (err, url) => {
        if (err) console.error(err);
        else {
          console.log('url', url);
          return url
        }
      })
    }
    )},

      getLocalIpAddress: () => ipcRenderer.invoke('get-local-ip-address'), 
}),



  // // Function to get the local IP address
  // function getLocalIpAddress() {
  //   const networkInterfaces = os.networkInterfaces();
  //   for (const interfaceName in networkInterfaces) {
  //     const networkInterface = networkInterfaces[interfaceName];
  //     for (const interface of networkInterface) {
  //       if (!interface.internal && interface.family === 'IPv4') {
  //         return interface.address;
  //       }
  //     }
  //   }
  //   return '127.0.0.1'; // Return localhost if no external IP found
  // }


  window.addEventListener('DOMContentLoaded', () => {
    // Define the getLocalIpAddress function here
    // function getLocalIpAddress() {
    //   const networkInterfaces = os.networkInterfaces();
    //   for (const interfaceName in networkInterfaces) {
    //     const networkInterface = networkInterfaces[interfaceName];
    //     for (const interface of networkInterface) {
    //       if (!interface.internal && interface.family === 'IPv4') {
    //         return interface.address;
    //       }
    //     }
    //   }
    //   return '127.0.0.1'; // Return localhost if no external IP found
    // }

    const replaceText = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) element.innerText = text;
    }

    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type]);
    }

    // Get the local IP address
    // const localIpAddress = getLocalIpAddress();

    // // Generate QR code using the local IP address
    // qrcode.toDataURL(localIpAddress + ':443', (err, url) => {
    //   if (err) console.error(err);
    //   else {
    //     console.log('url', url);
    //     // Create an image element to display the QR code
    //     const qrContainer = document.createElement('div');
    //     qrContainer.style.textAlign = 'center'; // Center align the content
    //     qrContainer.style.position = 'fixed'; // Fix position to the bottom
    //     qrContainer.style.bottom = '0'; // Position at the bottom
    //     qrContainer.style.width = '100%'; // Take full width
    //     qrContainer.style.backgroundColor = '#fff'; // Background color
    //     qrContainer.style.padding = '10px'; // Padding for aesthetics

    //     // Create a title element
    //     const title = document.createElement('h2');
    //     title.textContent = 'Scan to start Magic Mirror';
    //     qrContainer.appendChild(title); // Append the title to the container

    //     // Create an image element to display the QR code
    //     const imgWifi = document.createElement('img');
    //     imgWifi.src = url;
    //     qrContainer.appendChild(imgWifi); // Append the image to the container

    //     document.body.appendChild(qrContainer);


    //     // const img = document.createElement('img');
    //     // img.src = url;
    //     // document.body.appendChild(img); // Assuming you want to append to the body
    //   }
    // });
    ipcRenderer.on('set-ip-address', (event, ipAddress) => {
      // Use ipAddress to generate or update QR code
      // Example: 
      updateQRCode(ipAddress);
    });
    // function generateWifiURL(ssid, password) {
    //   return `WIFI:S:${ssid};T:WPA;P:${password};;`;
    // }
    // Replace 'your_ssid' and 'your_password' with actual SSID and password
    // const ssid = 'TP-Link_CDDC_5G';
    // const password = '52269189';
    // const wifiURL = generateWifiURL(ssid, password);

    // Generate QR code for the WiFi connection URL
    // qrcode.toDataURL(wifiURL, function (err, url) {
    //   if (err) throw err;
    //   else {
    //     console.log('url', url);
    //     // Create a container for the QR code and the title
    //     const qrContainer = document.createElement('div');
    //     qrContainer.style.textAlign = 'center'; // Center align the content
    //     qrContainer.style.position = 'fixed'; // Fix position to the bottom
    //     qrContainer.style.bottom = '0'; // Position at the bottom
    //     qrContainer.style.width = '100%'; // Take full width
    //     qrContainer.style.backgroundColor = '#fff'; // Background color
    //     qrContainer.style.padding = '20px'; // Padding for aesthetics

    //     // Create a title element
    //     const title = document.createElement('h2');
    //     title.textContent = 'Scan to get Wifi';
    //     qrContainer.appendChild(title); // Append the title to the container

    //     // Create an image element to display the QR code
    //     const img = document.createElement('img');
    //     img.src = url;
    //     qrContainer.appendChild(img); // Append the image to the container

    //     document.body.appendChild(qrContainer); // Append the container to the body
    //   }
    // })
    // ipcRenderer.on('wifi-details', (event, details) => {
    //   console.log('Received Wi-Fi details:', details);
    //   // Update UI or logic based on Wi-Fi details
    // });
  })