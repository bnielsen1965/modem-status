
# modem-status

A module for NodeJS applications used to read and parse information from user accessible
web pages on an internet provider modem.

It may be useful to record modem status information over time for network diagnostics and
preventative monitoring. In many cases the modem used to connect to an internet provider
will have an interface from which status details can be derived, i.e. web pages.

This module is used to extract status details from the modem so the data can then be
recorded or analyzed.


# Install

> npm install --save modem-status


# Usage

Load the module into your node application and call the static methods with the parameters
needed to scan your modem...

```javascript
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
```


# Methods


## getStatus (url, [parserName], [options])

The *getStatus()* method is used to get the current status details from the modem. An
object will be returned by the method with the extracted details.


### url

The *url* parameter is required, it is the fully qualified path to the status page on
the modem, i.e. *http://192.168.100.1/RgConnect.asp*


### parserName

The *parserName* argument is the name of the modem parser to use. If not specified the
default *arris-cox* parser will be used.


### options

The optional *options* argument is an options object that will be passed to the HTTP
or HTTPS request method. See the NodeJS docs for details about option parameters that
can be passed.


# Parsers

The module is designed to dynamically load a parser module based on the modem model that
is used.


## arris-cox

The *arris-cox* parser is used to parse Arris cable modems used on the Cox network.
