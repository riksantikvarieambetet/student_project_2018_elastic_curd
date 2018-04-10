// https://github.com/jprichardson/node-jsonfile
// https://github.com/digitalbazaar/jsonld.js // om vi ska parsa Json LD 
// https://json-ld.org/learn.html learn about json LD 
// https://www.npmjs.com/package/prettyjson funkar i terminalen och med require
var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var prettyjson = require('prettyjson');
var file = './jsonFiles/data.json'

const ksam = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&stylesheet=stylesheet/searchStyle.xsl&query=item=yxa&place=gotland&startRecord=10&hitsPerPage=25&recordSchema=presentation&x-api=test'
const ksam2 = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland&startRecord=10&hitsPerPage=10&recordSchema=presentation&x-api=test';
// Visby 
const ksam3 = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland AND thumbnailExists="j" AND text=visby&startRecord=0&hitsPerPage=200&recordSchema=presentation&x-api=test'

//--- delete index 
// curl -XDELETE 'localhost:9200/bank?pretty' 

//--- list all indexes 
// curl -XGET 'localhost:9200/_cat/indices?v&pretty' 

// -- Kör inmatning från fil(lägg filen i 'bin'):
// curl -XPOST 'localhost:9200/images/googleVision/_bulk?pretty' --data-binary "@c:\data.json" -H 'Content-Type: application/json'



async function test() {

  var data = await fetchAsync(ksam3);

  records = data.result.records.record;

  for (const element of records) {

    element['pres:item'].googleVision = await getImageData(element['pres:item']['pres:image']['pres:src'][0].content);

    // Riskabelt! borde traversera nycklar och och substringa pres: istället.
    var newElement = JSON.stringify(element['pres:item']).replace(/pres:/g, "");
    newElement = JSON.parse(newElement);

    await writeFileAsync({ "index": { "_id": newElement.id } }, '_id append: ' + newElement.id);
    await writeFileAsync(newElement, 'element appended id: ' + newElement.id);

  }


}

async function writeFileAsync(data, message) {
  return new Promise((resolve) => {
    jsonfile.writeFile(file, data, { flag: 'a' }, (err, file) => {
      if (err) throw err;
      console.log(message)
      resolve();
    })

  })
}

function test2() {

  let test = { "pres:description": "Visby innerstad. Okänd plats. Husfasad med fönster.", "pres:organizationShort": "RAÄ", "pres:service": "Kulturmiljöbild", "pres:id": 16001000531250, "pres:image": { "pres:mediaLicense": "http://kulturarvsdata.se/resurser/License#by", "pres:byline": "Nilson, Key", "pres:motive": "Visby", "pres:copyright": "RAÄ", "pres:src": [{ "content": "http://kmb.raa.se/cocoon/bild/raa-image/16001000531250/normal/1.jpg", "type": "lowres" }, { "content": "http://kmb.raa.se/cocoon/bild/raa-image/16001000531250/thumbnail/1.jpg", "type": "thumbnail" }] }, "pres:organization": "Riksantikvarieämbetet", "pres:buildDate": "2017-12-12", "pres:idLabel": "KN0220", "pres:representations": { "pres:representation": [{ "content": "http://kulturarvsdata.se/raa/kmb/rdf/16001000531250", "format": "RDF" }, { "content": "http://kulturarvsdata.se/raa/kmb/xml/16001000531250", "format": "Presentation" }, { "content": "http://kulturarvsdata.se/raa/kmb/html/16001000531250", "format": "HTML" }] }, "xmlns:pres": "http://kulturarvsdata.se/presentation#", "pres:itemLabel": "Visby", "pres:entityUri": "http://kulturarvsdata.se/raa/kmb/16001000531250", "pres:context": { "pres:nameLabel": "Nilson, Key", "pres:placeLabel": "Län: Gotland, Kommun: Gotland, Landskap: Gotland, Socken: Visby", "pres:timeLabel": "1980-01-01 - 2000-12-31" }, "pres:version": 1.11, "pres:type": "Foto", "pres:tag": "Riksintressen", "googleVision": { "responses": [{ "labelAnnotations": [{ "mid": "/m/0d4v4", "description": "window", "score": 0.90690655, "topicality": 0.90690655 }, { "mid": "/m/03jm5", "description": "house", "score": 0.87136436, "topicality": 0.87136436 }, { "mid": "/m/01l0mw", "description": "home", "score": 0.7836015, "topicality": 0.7836015 }, { "mid": "/m/01x314", "description": "facade", "score": 0.7687424, "topicality": 0.7687424 }, { "mid": "/m/0cgh4", "description": "building", "score": 0.622446, "topicality": 0.622446 }, { "mid": "/m/083vt", "description": "wood", "score": 0.6154273, "topicality": 0.6154273 }, { "mid": "/m/037cyw", "description": "siding", "score": 0.6095547, "topicality": 0.6095547 }, { "mid": "/m/02dgv", "description": "door", "score": 0.57958984, "topicality": 0.57958984 }, { "mid": "/m/06hyd", "description": "roof", "score": 0.574335, "topicality": 0.574335 }, { "mid": "/m/01g0g", "description": "brick", "score": 0.5661836, "topicality": 0.5661836 }, { "mid": "/m/01__sk", "description": "brickwork", "score": 0.56011444, "topicality": 0.56011444 }], "imagePropertiesAnnotation": { "dominantColors": { "colors": [{ "color": { "red": 20, "green": 23, "blue": 18 }, "score": 0.42956528, "pixelFraction": 0.25937313 }, { "color": { "red": 226, "green": 228, "blue": 221 }, "score": 0.10662843, "pixelFraction": 0.036649473 }, { "color": { "red": 133, "green": 125, "blue": 104 }, "score": 0.04568288, "pixelFraction": 0.03600476 }, { "color": { "red": 49, "green": 50, "blue": 41 }, "score": 0.14901917, "pixelFraction": 0.17620511 }, { "color": { "red": 198, "green": 200, "blue": 192 }, "score": 0.075426035, "pixelFraction": 0.066107914 }, { "color": { "red": 82, "green": 82, "blue": 72 }, "score": 0.057192177, "pixelFraction": 0.10027772 }, { "color": { "red": 119, "green": 119, "blue": 109 }, "score": 0.03779115, "pixelFraction": 0.043344576 }, { "color": { "red": 154, "green": 153, "blue": 142 }, "score": 0.024768699, "pixelFraction": 0.073398136 }, { "color": { "red": 158, "green": 147, "blue": 123 }, "score": 0.02126122, "pixelFraction": 0.024201548 }, { "color": { "red": 51, "green": 49, "blue": 33 }, "score": 0.020681167, "pixelFraction": 0.02886332 }] } }, "cropHintsAnnotation": { "cropHints": [{ "boundingPoly": { "vertices": [{}, { "x": 777 }, { "x": 777, "y": 779 }, { "y": 779 }] }, "confidence": 0.79999995, "importanceFraction": 1 }] } }] } };
  /* let newItem = JSON.stringify(test);
  newItem = newItem.replace(/pres:/g, "");
  newItem = JSON.parse(newItem); */
  test = JSON.stringify(test).replace(/pres:/g, "")
  test = JSON.parse(test);

  console.log(prettyjson.render(test, {
    keysColor: 'green',
    dashColor: 'yellow',
    stringColor: 'white',
    numberColor: 'red'
  }))

}

test();
/* 
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
}) */


async function fetchAsync(url) {
  return await (await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }
  )).json();
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
          "maxResults": 20
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
