const { exec } = require('child_process');
const qrcode = require('qrcode');

function getWifiDetails(password, encryptionType, callback) {
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows command to get SSID
    const cmd = 'netsh wlan show interfaces';
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to execute command: ${cmd}`);
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Inform the user about the need for administrative privileges or log the error for further analysis.
        return callback(new Error('Failed to get Wi-Fi details. Please ensure the application has administrative privileges and that your device has a wireless interface.'), null);
      }
      const ssidLine = stdout.split('\n').find(line => line.trim().startsWith('SSID'));
      if (ssidLine) {
        const ssid = ssidLine.split(':')[1].trim();
        generateWifiQRCode(ssid, password, encryptionType, callback);
      }
    });
  } else if (platform === 'darwin') {
    // macOS command to get SSID
    const cmd = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'";
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to execute command: ${cmd}`);
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Inform the user about the need for administrative privileges or log the error for further analysis.
        return callback(new Error('Failed to get Wi-Fi details. Please ensure the application has administrative privileges and that your device has a wireless interface.'), null);
      }
      const ssid = stdout.trim();
      generateWifiQRCode(ssid, password, encryptionType, callback);
    });
  } else if (platform === 'linux') {
    // Linux command to get SSID
    const cmd = 'nmcli -t -f active,ssid dev wifi | egrep \'^yes\' | cut -d \':\' -f2';
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to execute command: ${cmd}`);
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        // Inform the user about the need for administrative privileges or log the error for further analysis.
        return callback(new Error('Failed to get Wi-Fi details. Please ensure the application has administrative privileges and that your device has a wireless interface.'), null);
      }
      const ssid = stdout.trim();
      generateWifiQRCode(ssid, password, encryptionType, callback);
    });
  } else {
    callback(new Error('Unsupported platform'), null);
  }
}

function generateWifiQRCode(ssid, password, encryptionType, callback) {
  const wifiString = `WIFI:S:${ssid};T:${encryptionType};P:${password};;`;
  qrcode.toDataURL(wifiString, (err, url) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, url);
    }
  });
}

module.exports = { getWifiDetails };
