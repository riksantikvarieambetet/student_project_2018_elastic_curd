// https://github.com/jprichardson/node-jsonfile
var fetch = require('node-fetch');
var jsonfile = require('jsonfile');
var file = '/tmp/data.json'

const ksam = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&stylesheet=stylesheet/searchStyle.xsl&query=item=yxa&place=gotland&startRecord=10&hitsPerPage=25&recordSchema=presentation&x-api=test'

/* const fetchAsyncA = async (url) => await (await fetch(url)).json();
 */
// .result.records.record[1]["pres:item"]["pres:image"]["pres:src"][2].content


async function test() {


  // console.log(await fetchAsync(ksam));
  var data = await fetchAsync(ksam);
  jsonfile.writeFile(file, data, err => console.log(err))



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

async function timedTest1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('hello1')
    }, 2000)
  })
}

async function timedTest2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('hello2')
    }, 200)
  })
}

