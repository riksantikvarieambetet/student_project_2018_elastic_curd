var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var file = '/tmp/data.json';

const apiKey = 'AIzaSyAVjubBDQQdBMHZrqXmJUVyun6t0Lsb2Ho';
const visionUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey;

function getImageData(imgUrl) {
  let images = {
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

  fetch(visionUrl, {
    method: 'post',
    headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    body: JSON.stringify(images)
  }).then((res) => {
    return res.json()
  }).catch((err) => {
    console.log(err)
  });
}

/* {
  "responses": [
    {
      "labelAnnotations": [
        { "mid": "/m/0bt9lr", "description": "dog", "score": 0.9720932, "topicality": 0.9720932 },
        { "mid": "/m/0kpmf", "description": "dog breed", "score": 0.9429045, "topicality": 0.9429045 },
        { "mid": "/m/01z5f", "description": "dog like mammal", "score": 0.94216734, "topicality": 0.94216734 },
        { "mid": "/m/0d7s3w", "description": "puppy", "score": 0.82894707, "topicality": 0.82894707 },
        { "mid": "/m/05mqq3", "description": "snout", "score": 0.7474614, "topicality": 0.7474614 },
        { "mid": "/m/03q44n", "description": "pinscher", "score": 0.71641827, "topicality": 0.71641827 },
        { "mid": "/m/01lrl", "description": "carnivoran", "score": 0.6399205, "topicality": 0.6399205 },
        { "mid": "/m/03yl64", "description": "companion dog", "score": 0.6042771, "topicality": 0.6042771 },
        { "mid": "/m/0b6c67", "description": "german pinscher", "score": 0.57502264, "topicality": 0.57502264 },
        { "mid": "/m/01l7qd", "description": "whiskers", "score": 0.56344444, "topicality": 0.56344444 },
        { "mid": "/m/0415w9g", "description": "rare breed dog", "score": 0.5514063, "topicality": 0.5514063 },
        { "mid": "/m/07r2m5", "description": "black and tan terrier", "score": 0.5503982, "topicality": 0.5503982 },
        { "mid": "/m/03svl1", "description": "miniature pinscher", "score": 0.53360474, "topicality": 0.53360474 },
        { "mid": "/m/03f5jh", "description": "dog crossbreeds", "score": 0.52074534, "topicality": 0.52074534 },
        { "mid": "/m/0h7_1g", "description": "plummer terrier", "score": 0.52071565, "topicality": 0.52071565 }],
      "imagePropertiesAnnotation":
        {
          "dominantColors": {
            "colors": [{ "color": { "red": 120, "green": 171, "blue": 89 }, "score": 0.15114385, "pixelFraction": 0.086 },
            { "color": { "red": 177, "green": 207, "blue": 159 }, "score": 0.04714198, "pixelFraction": 0.038066667 },
            { "color": { "red": 78, "green": 43, "blue": 29 }, "score": 0.01580461, "pixelFraction": 0.054 },
            { "color": { "red": 25, "green": 20, "blue": 17 }, "score": 0.0050100163, "pixelFraction": 0.014333333 },
            { "color": { "red": 155, "green": 206, "blue": 125 }, "score": 0.15104602, "pixelFraction": 0.09053333 },
            { "color": { "red": 115, "green": 172, "blue": 64 }, "score": 0.13849695, "pixelFraction": 0.069133334 },
            { "color": { "red": 81, "green": 138, "blue": 32 }, "score": 0.062383123, "pixelFraction": 0.030266667 },
            { "color": { "red": 84, "green": 134, "blue": 53 }, "score": 0.054953407, "pixelFraction": 0.029333333 },
            { "color": { "red": 149, "green": 205, "blue": 96 }, "score": 0.046265844, "pixelFraction": 0.0236 },
            { "color": { "red": 206, "green": 238, "blue": 192 }, "score": 0.04341256, "pixelFraction": 0.036466666 }]
          }
        },
      "cropHintsAnnotation":
        {
          "cropHints": [{
            "boundingPoly": { "vertices": [{}, { "x": 1023 }, { "x": 1023, "y": 683 }, { "y": 683 }] },
            "confidence": 0.79999995, "importanceFraction": 1
          }]
        }
    }]
} */