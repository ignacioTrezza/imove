const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws'); // Import the WebSocket library
// const KalmanFilter ;

// const gyroKalmanFilter = new KalmanFilter();
// const accGravKalmanFilter = new KalmanFilter();
// const accKalmanFilter = new KalmanFilter();



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
      const sensorType = data.tipo;
      let processedData;

      if (sensorType === 'Gyroscope') {
          processedData = {
              tipo: 'Gyroscope',
              alpha: KalmanFilter.filter(data.alpha),
              beta: KalmanFilter.filter(data.beta),
              gamma: KalmanFilter.filter(data.gamma)
          };
      } else if (sensorType === 'AccelerometerIncludingGravity') {
          processedData = {
              tipo: 'AccelerometerIncludingGravity',
              x: KalmanFilter.filter(data.x),
              y: KalmanFilter.filter(data.y),
              z: KalmanFilter.filter(data.z)
          };
      } else if (sensorType === 'Accelerometer') {
          processedData = {
              tipo: 'Accelerometer',
              x: KalmanFilter.filter(data.x),
              y: KalmanFilter.filter(data.y),
              z: KalmanFilter.filter(data.z)
          };
      }

      // Broadcast processed data to clients
      wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(processedData));
          }
      });
  } catch (e) {
      console.log('Error processing sensor data:', e);
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

// Function to apply Kalman filter to Gyroscope data
function applyKalmanFilterToGyroscope(alpha, beta, gamma) {
  // Implement Kalman filter processing for Gyroscope data
  // Return processed data
}

// Function to apply Kalman filter to AccelerometerIncludingGravity data
function applyKalmanFilterToAccelerometerIncludingGravity(x, y, z) {
  // Implement Kalman filter processing for AccelerometerIncludingGravity data
  // Return processed data
}

// Function to apply Kalman filter to Accelerometer data
function applyKalmanFilterToAccelerometer(x, y, z) {
  // Implement Kalman filter processing for Accelerometer data
  // Return processed data
}


function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
* KalmanFilter
* @class
* @author Wouter Bulten
* @see {@link http://github.com/wouterbulten/kalmanjs}
* @version Version: 1.0.0-beta
* @copyright Copyright 2015-2018 Wouter Bulten
* @license MIT License
* @preserve
*/
var KalmanFilter =
/*#__PURE__*/
function () {
  /**
  * Create 1-dimensional kalman filter
  * @param  {Number} options.R Process noise
  * @param  {Number} options.Q Measurement noise
  * @param  {Number} options.A State vector
  * @param  {Number} options.B Control vector
  * @param  {Number} options.C Measurement vector
  * @return {KalmanFilter}
  */
  function KalmanFilter() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$R = _ref.R,
        R = _ref$R === void 0 ? 1 : _ref$R,
        _ref$Q = _ref.Q,
        Q = _ref$Q === void 0 ? 1 : _ref$Q,
        _ref$A = _ref.A,
        A = _ref$A === void 0 ? 1 : _ref$A,
        _ref$B = _ref.B,
        B = _ref$B === void 0 ? 0 : _ref$B,
        _ref$C = _ref.C,
        C = _ref$C === void 0 ? 1 : _ref$C;

    _classCallCheck(this, KalmanFilter);

    this.R = R; // noise power desirable

    this.Q = Q; // noise power estimated

    this.A = A;
    this.C = C;
    this.B = B;
    this.cov = NaN;
    this.x = NaN; // estimated signal without noise
  }
  /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  * @return {Number}
  */


  _createClass(KalmanFilter, [{
    key: "filter",
    value: function filter(z) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (isNaN(this.x)) {
        this.x = 1 / this.C * z;
        this.cov = 1 / this.C * this.Q * (1 / this.C);
      } else {
        // Compute prediction
        var predX = this.predict(u);
        var predCov = this.uncertainty(); // Kalman gain

        var K = predCov * this.C * (1 / (this.C * predCov * this.C + this.Q)); // Correction

        this.x = predX + K * (z - this.C * predX);
        this.cov = predCov - K * this.C * predCov;
      }

      return this.x;
    }
    /**
    * Predict next value
    * @param  {Number} [u] Control
    * @return {Number}
    */

  }, {
    key: "predict",
    value: function predict() {
      var u = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.A * this.x + this.B * u;
    }
    /**
    * Return uncertainty of filter
    * @return {Number}
    */

  }, {
    key: "uncertainty",
    value: function uncertainty() {
      return this.A * this.cov * this.A + this.R;
    }
    /**
    * Return the last filtered measurement
    * @return {Number}
    */

  }, {
    key: "lastMeasurement",
    value: function lastMeasurement() {
      return this.x;
    }
    /**
    * Set measurement noise Q
    * @param {Number} noise
    */

  }, {
    key: "setMeasurementNoise",
    value: function setMeasurementNoise(noise) {
      this.Q = noise;
    }
    /**
    * Set the process noise R
    * @param {Number} noise
    */

  }, {
    key: "setProcessNoise",
    value: function setProcessNoise(noise) {
      this.R = noise;
    }
  }]);

  return KalmanFilter;
}();


module.exports = { KalmanFilter };
