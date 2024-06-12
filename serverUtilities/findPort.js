const net = require('node:net');
const restrictedPorts = [
  1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 139, 143, 179, 389, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 556, 563, 587, 601, 636, 993, 995, 2049, 3659, 4045, 6000, 6665, 6666, 6667, 6668, 6669

];
let redirectText = null;
function FindPort (portNumber) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    if (restrictedPorts.includes(portNumber)) {
      server.listen(0, () => {
        const port = server.address().port;
        server.close(() => {
          console.log(`Port provided ${portNumber} is restricted. Port ${port} provided instead.`);
          resolve(port);
        });
      });
    } else {
      server.listen(portNumber, () => {
        const port = server.address().port;
        server.close(() => {
          const text = redirectText !== null ? `${redirectText}${port}` : `Port provided ${portNumber} available`;
          console.log(text);
          redirectText = null;
          resolve(port);
        });
      });
    }
    server.on('error', (err) => {
      if (err) {
        redirectText = `Port ${portNumber} unavailable, redirecting to port `;
        FindPort(0)
          .then(port => resolve(port));
      } else {
        reject(err);
      }
    });
  });
}

module.exports = {
  FindPort
};
