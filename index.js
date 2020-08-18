
const URL = require('url');
const HTTP = require('http');
const HTTPS = require('https');

const DefaultParser = 'arris-cox';

class ModemStatus {
  // get the modem status
  static async getStatus (url, parserName, options) {
    let content = await ModemStatus.execRequest(url, options);
    let parser = ModemStatus.getParser(parserName || DefaultParser);
    return parser(content);
  }

  // get the named parser module
  static getParser (name) {
    return require(`./parsers/${name}.js`);
  }

  // execute an HTTP|HTTPS request to read a modem web page
  static execRequest (url, options) {
    return new Promise((resolve, reject) => {
      let lib = ModemStatus.getLib(url);
      let req = lib.request(url, options, (res) => {
        let content = '';
        res.on('data', (chunk) => {
          content += chunk.toString();
        });
        res.on('end', () => resolve(content));
      });
      req.on('error', (error) => {
        reject(error);
      })
      req.end();
    });
  }

  // get the request library needed for the given url
  static getLib (url) {
    let urlo = URL.parse(url);
    let lib;
    switch (urlo.protocol) {
      case 'http:':
        return HTTP;

      case 'https:':
        return HTTPS;
    }
    throw new Error(`Unknown protocol ${urlo.protocol}.`);
  }
}

module.exports = ModemStatus;
