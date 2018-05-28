# Google Vision and K-Samsök Merge

Merges data from Google Vision and K-Samsök. The result is stored in a ND-JSON file suitable for Elasticsearch bulk uploads. (This script was a onetime use case. for further use, a complete overhaul of code is necessary)


## Getting Started

### Prerequisites

* Google Vision API-key need to be submitted in index.js
* Nodejs needs to be installed on your system. Check documentation for your Operating System at https://nodejs.org/en/


### Installing

* Install Nodejs

To install required dependencies run:
```
npm install
```

## Deployment

### Run project
```
npm start
```

## Built With

* [Node.JS](https://nodejs.org/en/) - The framework used.
* [RGBtoHSL](https://www.npmjs.com/package/rgb-to-hsl) - Node.JS library for converting RGB to HSL
* [Node-Fetch](https://www.npmjs.com/package/node-fetch) - A light-weight module that brings window.fetch to Node.js

## Authors

* [Alfred Bjersander](alfred.bjersander@gmail.com)
* [Max Collin](maxcollin@gmail.com)
 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
