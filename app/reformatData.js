var prettyjson = require('prettyjson');
var jsonfile = require('jsonfile');
var rgbToHsl = require('rgb-to-hsl');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./jsonFiles/data2.json')
});

async function convertRGB() {
  var newFormat = [];
  lineReader.on('line', function (line) {
    object = JSON.parse(line);
    if (object.googleVision) {
      object.googleVision.responses[0].imagePropertiesAnnotation.dominantColors.colors.forEach(element => {
        let col = element.color;

        let hsl = rgbToHsl(col.red, col.green, col.blue)
        let H = hsl[0];
        let parsedS = parseFloat(hsl[1].substring(0, hsl[1].length - 1));
        let parsedL = parseFloat(hsl[2].substring(0, hsl[2].length - 1));

        element.color = { h: H, s: parsedS, l: parsedL }
      });
    }
    //pushToNew(object);
    newFormat.push(object)
    if (newFormat.length === 296) {
      for (var x of newFormat) {
        writeFileAsync(x, "printing line");
      }
    }
  })
}

async function reformat() {
  var newFormat = [];
  lineReader.on('line', function (line) {
    object = JSON.parse(line)
    if (object.googleVision) {
      object.googleVision.responses[0].labelAnnotations.forEach(element => {
        element.score = Math.floor(Math.round(element.score * 100));
      });
    }
    //pushToNew(object);
    newFormat.push(object)
    if (newFormat.length === 296) {
      for (var x of newFormat) {
        writeFileAsync(x, "printing line");
      }
    }
    //consoleLogJson(object)
  });

  console.log(newFormat.length)

  for (var jsonObject of newFormat) {
    await writeFileAsync(jsonObject, "printing line");
  }
}

async function writeFileAsync(data, message) {
  var file = './jsonFiles/data3.json'
  return new Promise((resolve) => {
    jsonfile.writeFile(file, data, { flag: 'a' }, (err, file) => {
      if (err) throw err;
      console.log(message)
      resolve();
    })

  })
}

function consoleLogJson(object) {
  console.log(prettyjson.render(object, {
    keysColor: 'green',
    dashColor: 'yellow',
    stringColor: 'white',
    numberColor: 'red'
  }))
}

function test() {
  console.log("hej")
}

/* reformat(); */
convertRGB(writeFileAsync);