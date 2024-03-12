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
  console.log(`moveCursorDetected (X:${x}, Y:${y}, ${event})`)
  robot.moveMouse(x, y); // Move the cursor to the specified position
});
ipcMain.on('click-mouse', (event, { x, y }) => {
  console.log(`MouseClick detected (X:${x}, Y:${y})`)
  robot.mouseClick(); //{button: 'left'}  Move the cursor to the specified position
});