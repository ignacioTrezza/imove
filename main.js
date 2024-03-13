const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('node:path')
const robot = require('robotjs'); // Import robotjs
const server = require('./server.js');
const os = require('os'); // Import the os module

//Inicializo el servidor
server;

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true, // Keep this enabled for security
        nodeIntegration: true, // Enable node integration to use qrcode
      }
    })
  
    win.loadFile(path.join(__dirname, 'PUBLIC/dist/client/browser/index.html'));   
     // win.loadURL('http://localhost:4200')
  }
  
  app.whenReady().then(() => {
    createWindow()
    session.defaultSession.setCertificateVerifyProc((request, callback) => {
      if (request.hostname === '192.168.0.129') {
        callback(0); // Bypass certificate validation
      } else {
        callback(-2); // Use default certificate validation for other domains
      }
    });
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
// Listen for the move-cursor message
ipcMain.on('move-cursor', (event, { x, y }) => {
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
  robot.moveMouse(newX, newY); // Move the cursor to the specified position
});
ipcMain.on('click-mouse', (event) => {
  console.log(`MouseClick detected (Event:${event})`)
  robot.mouseClick(); //{button: 'left'}  Move the cursor to the specified position
});


