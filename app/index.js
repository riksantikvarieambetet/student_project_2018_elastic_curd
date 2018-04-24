// https://github.com/jprichardson/node-jsonfile
// https://github.com/digitalbazaar/jsonld.js // om vi ska parsa Json LD 
// https://json-ld.org/learn.html learn about json LD 
// https://www.npmjs.com/package/prettyjson funkar i terminalen och med require

var rgbToHsl = require('rgb-to-hsl');
var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var prettyjson = require('prettyjson');


const ksam = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&stylesheet=stylesheet/searchStyle.xsl&query=item=yxa&place=gotland&startRecord=10&hitsPerPage=25&recordSchema=presentation&x-api=test'
const ksam2 = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland&startRecord=0&hitsPerPage=1&recordSchema=presentation&x-api=test';
// Visby 
const ksam3 = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland AND thumbnailExists="j" AND text=visby&startRecord=0&hitsPerPage=200&recordSchema=presentation&x-api=test'

// Fetcha highres

buildRandomFetchUrl();

async function buildRandomFetchUrl() {

  let rounds = 1000;
  let random_set = new Set();

  for (let i = 0; i < rounds; i++) {

    let rand = Math.floor((Math.random() * 1800000) + 1);
    if (random_set.has(rand)) {
      rounds += 1;
    } else {
      random_set.add(rand)
    }
  }

  for (let number of random_set) {
    var ksam_random = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND thumbnailExists="j"&startRecord=' + number + '&hitsPerPage=' + 1 + '&recordSchema=presentation&x-api=test'
    await runFetchchain(ksam_random, number);
  }
}



async function runFetchchain(fetchString, number) {

  var data = await fetchAsync(fetchString);
  records = data.result.records.record;

  if (!records['pres:item']['pres:image']['pres:src'][0] ||
    !records['pres:item']['pres:image']['pres:src'] ||
    !records['pres:item']['pres:image'] ||
    !records['pres:item']) {
    console.log("src no array")
    return;
  }

  let imgAddress = null;
  for (src of records['pres:item']['pres:image']['pres:src']) {
    if (src.type === 'highres') {
      imgAddress = src.content
      console.log("highres found")
    }
  }

  if (imgAddress === null) {
    console.log("no highres")
    return;
  }

  let result = await fetchAsyncCheck(imgAddress).catch((err) => { return err; })
  if (result.status != 200) {
    console.log("bad imgAddress")
    return;
  }

  /*   records['pres:item'].googleVision = await getImageData(imgAddress); */

  //Riskabelt! borde traversera nycklar och och substringa pres: istället.
  var newElement = JSON.stringify(records['pres:item']).replace(/pres:/g, "");
  newElement = JSON.parse(newElement);

  /*   if (!newElement.googleVision.responses[0].labelAnnotations ||
      !newElement.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors ||
      !newElement.googleVision.responses[0]) return;
  
    // We have to change scores to ints because serchkit cant handle floats for filtering
    newElement.googleVision.responses[0].labelAnnotations.forEach(element => {
      element.score = Math.floor(Math.round(element.score * 100));
    }); */


  /*   newElement.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors.forEach(element => {
      let col = element.color;
      let hsl = rgbToHsl(col.red, col.green, col.blue)
      let H = hsl[0];
      let parsedS = parseFloat(hsl[1].substring(0, hsl[1].length - 1));
      let parsedL = parseFloat(hsl[2].substring(0, hsl[2].length - 1));
      element.color = { h: H, s: parsedS, l: parsedL }
    }); */

  let file = './jsonFiles/test_data2.json'
  let file2 = './jsonFiles/test_data_fetched.json'

  await writeFileAsync({ "index": { "_id": newElement.id } }, '_id append: ' + newElement.id, file);
  await writeFileAsync(newElement, 'element appended id: ' + newElement.id, file);
  await writeFileAsync(number + ",", "Klart", file2)
}

async function fetchAsync(url) {
  return await (await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }
  )).json();
}

async function fetchAsyncCheck(url) {
  return await (await fetch(url).then((response) => {
    return response;
  })
  );
}

async function writeFileAsync(data, message, file) {
  return new Promise((resolve) => {
    jsonfile.writeFile(file, data, { flag: 'a' }, (err, file) => {
      if (err) throw err;
      console.log(message)
      resolve();
    })

  })
}

async function getImageData(imgUrl) {
  const apiKey = 'AIzaSyAVjubBDQQdBMHZrqXmJUVyun6t0Lsb2Ho';
  const visionUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey;
  let image = {
    "requests": [{
      "image": {
        "source": {
          "imageUri": imgUrl
        }
      },
      "features": [
        {
          "type": "LABEL_DETECTION",
          "maxResults": 100
        },
        {
          "type": "IMAGE_PROPERTIES",
          "maxResults": 20
        }
      ]
    }]
  }

  return await (await fetch(visionUrl, {
    method: 'post',
    headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    body: JSON.stringify(image)
  })).json()
}

function test() {

  var bla = { "description": "Visby från Kruttornet.", "organizationShort": "RAÄ", "service": "Kulturmiljöbild", "id": 16000300032372, "image": { "mediaLicense": "http://kulturarvsdata.se/resurser/License#by", "byline": "Lundberg, Bengt A", "motive": "Visby", "copyright": "RAÄ", "src": [{ "content": "http://kmb.raa.se/cocoon/bild/raa-image/16000300032372/normal/1.jpg", "type": "lowres" }, { "content": "http://kmb.raa.se/cocoon/bild/raa-image/16000300032372/thumbnail/1.jpg", "type": "thumbnail" }] }, "organization": "Riksantikvarieämbetet", "buildDate": "2017-12-12", "idLabel": "f0108208", "representations": { "representation": [{ "content": "http://kulturarvsdata.se/raa/kmb/rdf/16000300032372", "format": "RDF" }, { "content": "http://kulturarvsdata.se/raa/kmb/xml/16000300032372", "format": "Presentation" }, { "content": "http://kulturarvsdata.se/raa/kmb/html/16000300032372", "format": "HTML" }] }, "xmlns:pres": "http://kulturarvsdata.se/presentation#", "itemLabel": "Visby", "entityUri": "http://kulturarvsdata.se/raa/kmb/16000300032372", "context": { "nameLabel": "Lundberg, Bengt A", "placeLabel": "Län: Gotland, Kommun: Gotland, Landskap: Gotland, Socken: Visby", "timeLabel": "2001-08-15 - 2001-08-15" }, "version": 1.11, "type": "Foto", "tag": ["Riksintressen", "Världsarv"], "googleVision": { "responses": [{ "labelAnnotations": [{ "mid": "/m/0dx1j", "description": "town", "score": 0.94831514, "topicality": 0.94831514 }, { "mid": "/m/02nfxt", "description": "residential area", "score": 0.9398741, "topicality": 0.9398741 }, { "mid": "/m/06hyd", "description": "roof", "score": 0.92936975, "topicality": 0.92936975 }, { "mid": "/m/0180xr", "description": "neighbourhood", "score": 0.920433, "topicality": 0.920433 }, { "mid": "/m/03jm5", "description": "house", "score": 0.9155545, "topicality": 0.9155545 }, { "mid": "/m/05wrt", "description": "property", "score": 0.8987078, "topicality": 0.8987078 }, { "mid": "/m/01l0mw", "description": "home", "score": 0.8932604, "topicality": 0.8932604 }, { "mid": "/m/01bqvp", "description": "sky", "score": 0.87475926, "topicality": 0.87475926 }, { "mid": "/m/0750y", "description": "suburb", "score": 0.86370105, "topicality": 0.86370105 }, { "mid": "/m/039jbq", "description": "urban area", "score": 0.83067685, "topicality": 0.83067685 }, { "mid": "/m/0cgh4", "description": "building", "score": 0.8148789, "topicality": 0.8148789 }, { "mid": "/m/01n32", "description": "city", "score": 0.786401, "topicality": 0.786401 }, { "mid": "/m/09qqq", "description": "wall", "score": 0.7801738, "topicality": 0.7801738 }, { "mid": "/m/01x314", "description": "facade", "score": 0.71984524, "topicality": 0.71984524 }, { "mid": "/m/0d4v4", "description": "window", "score": 0.68394774, "topicality": 0.68394774 }, { "mid": "/m/0f0q9", "description": "village", "score": 0.68028677, "topicality": 0.68028677 }, { "mid": "/m/038t8_", "description": "estate", "score": 0.66901493, "topicality": 0.66901493 }, { "mid": "/m/0h8lhsd", "description": "outdoor structure", "score": 0.61700326, "topicality": 0.61700326 }, { "mid": "/m/023907r", "description": "real estate", "score": 0.6088585, "topicality": 0.6088585 }, { "mid": "/m/03nxtz", "description": "cottage", "score": 0.5849182, "topicality": 0.5849182 }], "imagePropertiesAnnotation": { "dominantColors": { "colors": [{ "color": { "red": 191, "green": 190, "blue": 195 }, "score": 0.1856185, "pixelFraction": 0.036990363 }, { "color": { "red": 121, "green": 117, "blue": 115 }, "score": 0.15344433, "pixelFraction": 0.29318014 }, { "color": { "red": 116, "green": 80, "blue": 67 }, "score": 0.13800927, "pixelFraction": 0.081616014 }, { "color": { "red": 162, "green": 158, "blue": 157 }, "score": 0.14826657, "pixelFraction": 0.07961453 }, { "color": { "red": 136, "green": 100, "blue": 84 }, "score": 0.06940821, "pixelFraction": 0.027427724 }, { "color": { "red": 94, "green": 85, "blue": 82 }, "score": 0.06758025, "pixelFraction": 0.1915493 }, { "color": { "red": 188, "green": 194, "blue": 214 }, "score": 0.06501391, "pixelFraction": 0.018828763 }, { "color": { "red": 105, "green": 85, "blue": 69 }, "score": 0.03772792, "pixelFraction": 0.052186806 }, { "color": { "red": 127, "green": 108, "blue": 92 }, "score": 0.030519864, "pixelFraction": 0.029799853 }, { "color": { "red": 105, "green": 78, "blue": 76 }, "score": 0.022687271, "pixelFraction": 0.022461083 }] } }, "cropHintsAnnotation": { "cropHints": [{ "boundingPoly": { "vertices": [{}, { "x": 511 }, { "x": 511, "y": 767 }, { "y": 767 }] }, "confidence": 0.79999995, "importanceFraction": 1 }] } }] } }

  bla.googleVision.responses[0].labelAnnotations.forEach(element => {
    element.score = Math.floor(Math.round(element.score * 100))
    console.log(element)
  });

}

function consoleLogJson(object) {
  console.log(prettyjson.render(object, {
    keysColor: 'green',
    dashColor: 'yellow',
    stringColor: 'white',
    numberColor: 'red'
  }))
}

