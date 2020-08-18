
const ModemStatus = require('../index.js');

let StatusURL = "http://192.168.100.1";

ModemStatus.getStatus(StatusURL)
  .then(status => {
    console.log('STATUS:', status);
    process.exit(0);
  })
  .catch(error => {
    console.log('ERROR', error.message);
    process.exit(1);
  });
