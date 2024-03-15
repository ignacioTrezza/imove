const { exec } = require('child_process');

function getWifiDetails(callback) {
  const platform = process.platform;
  
  if (platform === 'win32') {
    // Windows command to get SSID
    const cmd = 'netsh wlan show interfaces';
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return callback(error, null);
      }
      const ssidLine = stdout.split('\n').find(line => line.trim().startsWith('SSID'));
      if (ssidLine) {
        const ssid = ssidLine.split(':')[1].trim();
        return callback(null, { ssid });
      }
    });
  } else if (platform === 'darwin') {
    // macOS command to get SSID
    const cmd = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'";
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return callback(error, null);
      }
      const ssid = stdout.trim();
      return callback(null, { ssid });
    });
  } else if (platform === 'linux') {
    // Linux command to get SSID
    const cmd = 'nmcli -t -f active,ssid dev wifi | egrep \'^yes\' | cut -d \':\' -f2';
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return callback(error, null);
      }
      const ssid = stdout.trim();
      return callback(null, { ssid });
    });
  } else {
    callback(new Error('Unsupported platform'), null);
  }
}

module.exports = { getWifiDetails };
