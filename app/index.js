// https://github.com/jprichardson/node-jsonfile
// https://github.com/digitalbazaar/jsonld.js // om vi ska parsa Json LD 
// https://json-ld.org/learn.html learn about json LD 
var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var file = './jsonFiles/data.json'

const ksam = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&stylesheet=stylesheet/searchStyle.xsl&query=item=yxa&place=gotland&startRecord=10&hitsPerPage=25&recordSchema=presentation&x-api=test'
const ksam2 = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland&startRecord=10&hitsPerPage=10&recordSchema=presentation&x-api=test';
const ksam3 = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland AND thumbnailExists="j" AND text=visby&startRecord=0&hitsPerPage=200&recordSchema=presentation&x-api=test'
/* const fetchAsyncA = async (url) => await (await fetch(url)).json();
 */
// .result.records.record[1]["pres:item"]["pres:image"]["pres:src"][2].content


async function test() {


  // console.log(await fetchAsync(ksam));
  var data = await fetchAsync(ksam3);

  data.result.records.record.forEach(element => {
    //console.log(element['pres:description']);
    //console.log(element['pres:item']['pres:description'])
    console.log(element['pres:item']['pres:image']['pres:src'][0].content)
  });

  //console.log(data.result.records.record);


  // 
  /* jsonfile.writeFile(file, data, (err, file) => {
    if (err) throw err;
    console.log('file saved')
  })
 */


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


