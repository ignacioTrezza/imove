const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('node:path')
const robot = require('robotjs'); // Import robotjs
const server = require('./server.js');
const os = require('os'); // Import the os module
const  {getWifiDetails}  = require('./wifi-details.js'); // Adjust the path as necessary

//Inicializo el servidor
server;
let mainWindow; // Define mainWindow at the top
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
  return '127.0.0.1'; // Fallback to localhost
}
const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 1000,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true, // Keep this enabled for security
        nodeIntegration: true, // Enable node integration to use qrcode
      }
    })
  
    mainWindow.loadFile(path.join(__dirname, 'PUBLIC/dist/client/browser/index.html'));   
     // mainWindow.loadURL('http://localhost:4200')
  }
  
  app.whenReady().then(() => {
    createWindow();
    const localIpAddress = getLocalIpAddress();
    console.log(`Local IP Address: ${localIpAddress}`);
    // createWindow();
    session.defaultSession.setCertificateVerifyProc((request, callback) => {
      console.log('IPADRES', localIpAddress)
      if (request.hostname === localIpAddress) { // Replace with your hostname
        callback(0); // Trust the certificate
      } else {
        callback(0)
        // callback(-3); // Perform default certificate verification for other hostnames
      }
    });
    if (mainWindow) {
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-ip-address', localIpAddress);
      });
    }
  });
 
   
  
   
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
// Listen for the move-cursor message
ipcMain.on('modify-cursor-position', (event, { x, y }) => {

  console.log(`moveCursorDetected (X:${x}, Y:${y})`)
  const pos = robot.getMousePos();
  const sensitivity = 1.5; // Adjust this based on your needs
    let deltaX = x * sensitivity;
    let deltaY = y * sensitivity;

    // Calculate new position
    let newX = pos.x - (deltaX>=3 || deltaX<=-3 ? deltaX : 0);
    let newY =  pos.y - (deltaY>=3 || deltaY<=-3 ? deltaY : 0); // Subtract deltaY because screen coordinates in Y are inverted
    let newZ = 0;
    // Boundary checks (assuming screen resolution of 1920x1080, adjust as needed)
    newX = Math.max(0, Math.min(newX, 1920));
    newY = Math.max(0, Math.min(newY, 1080));
      // Handle accelerometer including gravity data
      // this.electronService.electronAPI.moveCursorTo(newX, newY);
  // robot.moveMouse(newX, newY); // Move the cursor to the specified position
  robot.moveMouseSmooth(newX, newY);
});
ipcMain.on('click-mouse', (event) => {
  robot.mouseClick(); //{button: 'left'}  Move the cursor to the specified position
});
ipcMain.handle('get-local-ip-address', async (event) => {
  return getLocalIpAddress() || '127.0.0.1'; // Assuming getLocalIpAddress is your function that returns the IP address
});
ipcMain.on('qr-code-wifi', (event) => {
  // Assuming you have a way to get password and encryptionType, or they are not needed
  getWifiDetails('yourPassword', 'WPA', (error, details) => {
    if (error) {
      console.error('Failed to get Wi-Fi details:', error);
      event.reply('wifi-details-error', error.message); // Send error back to renderer
    } else {
      console.log('Wi-Fi Details:', details);
      mainWindow.webContents.send('wifi-details', details); // Send details back to renderer
    }
  });
});
ipcMain.on('move-cursor', (event, { x, y }) => {
  let sensitivityX=1.5;
  let sensitivityY=1.5;
  if(x>=0 && x<2){
    sensitivityX=0;
  }else if(x>=2 && x<2.5){
    sensitivityX=1.5;
  }else if(x>=2.5 && x<3.5){
    sensitivityX=2.5;
  }else if(x>=3.5 && x<5){
    sensitivityX=5;
  }else if(x>=5 && x<7){
    sensitivityX=10;
  }else if(x>7){
    sensitivityX=20;
  }
  if(y>=0 && y<1){
    sensitivityY=0;
  }else if(y>=1 && y<2){
    sensitivityY=1.5;
  }else if(y>=2 && y<3){
    sensitivityY=2.5;
  }else if(y>=3 && y<4){
    sensitivityY=5;
  }else if(y>=4 && y<6){
    sensitivityY=10;
  }else if(y>6){
    sensitivityY=20;
  }
  console.log(`moveCursorDetected (X:${x}, Y:${y})`);
  const pos = robot.getMousePos();

  let deltaX = x * sensitivityX;
  let deltaY = y * sensitivityY;

  // Calculate new position
  let newX = pos.x + deltaX; // Add deltaX to move horizontally
  let newY = pos.y + deltaY; // Add deltaY to move vertically

  // Get the screen size dynamically
  const screenSize = robot.getScreenSize();
  const maxWidth = screenSize.width;
  const maxHeight = screenSize.height;

  // Boundary checks
  newX = Math.max(0, Math.min(newX, maxWidth));
  newY = Math.max(0, Math.min(newY, maxHeight));

  // Move the cursor smoothly to the new position
  robot.moveMouseSmooth(newX, newY);
});

