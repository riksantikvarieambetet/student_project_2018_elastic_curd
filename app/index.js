var rgbToHsl = require('rgb-to-hsl');
var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var prettyjson = require('prettyjson');
var ignoreNumbers = require('./IgnoreNumbers')
var rounds = 200; // Amount of final fetches
var maxValue = 1123000; // Max number to randomize
var random_set = new Set(); // Number for objects to be fetched


// Set numbers to ignore from array in ignoreNumbers.js
setIgnoreNumbers();
function setIgnoreNumbers() {
  ignoreNumbers.forEach(element => {
    random_set.add(element);
  });
  buildRandomFetchUrl();
}

// Builds k-samsök URL with random fetch number.
async function buildRandomFetchUrl() {
  for (let i = 0; i < rounds; i++) {
    let rand = Math.floor((Math.random() * maxValue) + 1);
    if (random_set.has(rand)) {
      rounds += 1;
    } else {
      random_set.add(rand)
      var ksam_random = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND thumbnailExists="j" AND (mediaLicense="http://kulturarvsdata.se/resurser/license%23by-nc" OR mediaLicense="http://kulturarvsdata.se/resurser/license%23by-sa" OR mediaLicense="http://kulturarvsdata.se/resurser/license%23by" OR mediaLicense="http://kulturarvsdata.se/resurser/license%23pdmark%22)&startRecord=' + rand + '&hitsPerPage=1&recordSchema=presentation&x-api=test'
      await runFetchchain(ksam_random, rand);
    }
  }
}

async function runFetchchain(fetchString, number) {
  //Fetch JSON from k-samsök
  var data = await fetchAsync(fetchString)
  records = data.result.records.record;

  // Checks if source is complete before continuing.
  if (!records['pres:item']['pres:image']['pres:src'][0] ||
    !records['pres:item']['pres:image']['pres:src'] ||
    !records['pres:item']['pres:image'] ||
    !records['pres:item'] ||
    !records) {
    rounds += 1
    console.log("src not complete")
    return;
  }

  // Checks if source has context.
  if (typeof records['pres:item']['pres:context'] !== 'object') {
    rounds += 1
    console.log("No context object")
    return;
  }

  // Checks if source has atleast lowres image.
  let imgAddress = null;
  for (src of records['pres:item']['pres:image']['pres:src']) {
    if (src.type === 'lowres') {
      imgAddress = src.content
      console.log("lowres found")
    }
  }

  // If none of the objects has lowres image, abort.
  if (imgAddress === null) {
    console.log("no lowres")
    rounds += 1
    return;
  }

  // If source is from "Statens historiska museer", discard.
  if (records['pres:item']['pres:organizationShort'] === "SHM") {
    console.log('SHM found')
    rounds += 1
    return;
  }

  // Checks image adress before continuing, else abort.
  let result = await isImageAddressValid(imgAddress).catch((err) => { return err; })
  if (result.status != 200) {
    console.log("bad imgAddress")
    rounds += 1
    return;
  }

  // Fetches extra data from Google Vision.
  records['pres:item'].googleVision = await fetchGoogleVision(imgAddress);

  // Removes all pres: from objects. Be aware, this is a risky action and should
  // be handled in another way.
  var newElement = JSON.stringify(records['pres:item']).replace(/pres:/g, "");
  newElement = JSON.parse(newElement);

  // Checks that all data is retrived from Google Vision.
  if (!newElement.googleVision.responses[0].labelAnnotations ||
    !newElement.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors ||
    !newElement.googleVision.responses[0]) return;

  // Converts score to %
  newElement.googleVision.responses[0].labelAnnotations.forEach(element => {
    element.score = Math.floor(Math.round(element.score * 100));
  });

  // Converts Google Visions returned RGB to HSL.
  newElement.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors.forEach(element => {
    let col = element.color;
    let hsl = rgbToHsl(col.red, col.green, col.blue)
    let H = hsl[0];
    let parsedS = parseFloat(hsl[1].substring(0, hsl[1].length - 1));
    let parsedL = parseFloat(hsl[2].substring(0, hsl[2].length - 1));
    element.color = { h: H, s: parsedS, l: parsedL }
  });

  // File where result should be written to.
  let file = './jsonFiles/test_data3.json'
  // File where fetched random number should be written to.
  let file2 = './jsonFiles/test_data_fetched.json'

  // Filewriting
  await appendToFile({ "index": { "_id": newElement.id } }, '_id append: ' + newElement.id, file);
  await appendToFile(newElement, 'element appended id: ' + newElement.id, file);
  await appendToFile(number + ",", "Klart", file2)
}

async function fetchAsync(url) {
  return await (await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }
  )).json().catch((err) => { console.log(err)});
}

async function isImageAddressValid(url) {
  return await (await fetch(url).then((response) => {
    return response;
  })
  );
}

async function appendToFile(data, message, file) {
  return new Promise((resolve) => {
    jsonfile.writeFile(file, data, { flag: 'a' }, (err, file) => {
      if (err) throw err;
      console.log(message)
      resolve();
    })

  })
}

async function fetchGoogleVision(imgUrl) {
  // const apiKey = API-key from Google Vision;
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

