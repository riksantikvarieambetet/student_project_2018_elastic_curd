var fetch = require('node-fetch');

const apiKey = 'AIzaSyAVjubBDQQdBMHZrqXmJUVyun6t0Lsb2Ho';
const visionUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey;

async function getImageData(imgUrl, element) {
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

  fetch(visionUrl, {
    method: 'post',
    headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    body: JSON.stringify(image)
  }).then((res) => {
    return res.json()
  }).catch((err) => {
    console.log(err)
  });
}

module.exports.getImageData = getImageData;