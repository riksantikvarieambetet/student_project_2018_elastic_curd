var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var file = '/tmp/data.json';

const apiKey = 'AIzaSyAVjubBDQQdBMHZrqXmJUVyun6t0Lsb2Ho';
const visionUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey;

function getImageData(imgUrl) {
  images = {
    "requests": [{
      "image": {
        "source": {
          "imageUri": imgUrl
        }
      },
      "features": [
        {
          "type": "LABEL_DETECTION",
          "maxResults": 1
        }
      ]
    }]
  }

  fetch(visionUrl, {
    method: 'post',
    headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    body: JSON.stringify(images)
  }).then((res) => {
    res.json()
  }
  ).then(res => {
    console.log(res)
    return res;
  });
}