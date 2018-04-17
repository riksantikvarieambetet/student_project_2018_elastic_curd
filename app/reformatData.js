var prettyjson = require('prettyjson');
var jsonfile = require('jsonfile');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./jsonFiles/data.json')
});


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

function pushToNew(object) {
  newFormat.push(object)

}


async function writeFileAsync(data, message) {
  var file = './jsonFiles/data2.json'
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

reformat(writeFileAsync);