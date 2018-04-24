#!/usr/bin/env python3
import requests
import json

url = 'http://www.kulturarvsdata.se/ksamsok/api?method=search&query=itemType=foto AND provinceName=Gotland AND thumbnailExists="j" AND text=visby&startRecord=0&hitsPerPage=1&recordSchema=presentation&x-api=test'

testJson = {
    "test": {
        "test1": "hej",
        "test2": "hej igen",
        "test3": "nu funkar det"
    }
}

par = {
    "result": {
        "echo": {
            "hitsPerPage": 10,
            "method": "search",
            "query": "itemType=foto AND provinceName=Gotland AND thumbnailExists=\"j\" AND text=visby",
            "recordSchema": "presentation",
            "startRecord": 1
        },
        "records": {
            "record": [
                {
                    "pres:item": {
                        "pres:buildDate": "2017-12-12",
                        "pres:context": {
                            "pres:nameLabel": "Nilson, Key",
                            "pres:placeLabel": "L\u00e4n: Gotland, Kommun: Gotland, Landskap: Gotland, Socken: Visby",
                            "pres:timeLabel": "1980-01-01 - 2000-12-31"
                        },
                        "pres:description": "Visby innerstad. Korsningen Strandgatan och Packhusgatan. Tyska konsulatet.",
                        "pres:entityUri": "http://kulturarvsdata.se/raa/kmb/16001000531244",
                        "pres:id": 16001000531244,
                        "pres:idLabel": "KN0217",
                        "pres:image": {
                            "pres:byline": "Nilson, Key",
                            "pres:copyright": "RA\u00c4",
                            "pres:mediaLicense": "http://kulturarvsdata.se/resurser/License#by",
                            "pres:motive": "Visby",
                            "pres:src": [
                                {
                                    "content": "http://kmb.raa.se/cocoon/bild/raa-image/16001000531244/normal/1.jpg",
                                    "type": "lowres"
                                },
                                {
                                    "content": "http://kmb.raa.se/cocoon/bild/raa-image/16001000531244/thumbnail/1.jpg",
                                    "type": "thumbnail"
                                }
                            ]
                        },
                        "pres:itemLabel": "Visby",
                        "pres:organization": "Riksantikvarie\u00e4mbetet",
                        "pres:organizationShort": "RA\u00c4",
                        "pres:representations": {
                            "pres:representation": [
                                {
                                    "content": "http://kulturarvsdata.se/raa/kmb/rdf/16001000531244",
                                    "format": "RDF"
                                },
                                {
                                    "content": "http://kulturarvsdata.se/raa/kmb/xml/16001000531244",
                                    "format": "Presentation"
                                },
                                {
                                    "content": "http://kulturarvsdata.se/raa/kmb/html/16001000531244",
                                    "format": "HTML"
                                }
                            ]
                        },
                        "pres:service": "Kulturmilj\u00f6bild",
                        "pres:tag": "Riksintressen",
                        "pres:type": "Foto",
                        "pres:version": 1.11,
                        "xmlns:pres": "http://kulturarvsdata.se/presentation#"
                    },
                    "rel:score": {
                        "content": 5.375124,
                        "xmlns:rel": "info:srw/extension/2/relevancy-1.0"
                    }
                },
                {
                    "pres:item": {
                        "pres:buildDate": "2017-12-12",
                        "pres:context": {
                            "pres:nameLabel": "Rosenberg, Carl Gustaf",
                            "pres:placeLabel": "L\u00e4n: Gotland, Kommun: Gotland, Landskap: Gotland, Socken: Visby"
                        },
                        "pres:description": "Visby flygplats. Bilden \u00e4r troligen fr\u00e5n 1940-talets f\u00f6rsta h\u00e4lft.",
                        "pres:entityUri": "http://kulturarvsdata.se/raa/kmb/16001000021668",
                        "pres:id": 16001000021668,
                        "pres:idLabel": "cgrgo84d",
                        "pres:image": {
                            "pres:byline": "Rosenberg, Carl Gustaf",
                            "pres:copyright": "Utg\u00e5ngen upphovsr\u00e4tt",
                            "pres:mediaLicense": "http://kulturarvsdata.se/resurser/License#pdmark",
                            "pres:motive": "Visby",
                            "pres:src": [
                                {
                                    "content": "http://kmb.raa.se/cocoon/bild/raa-image/16001000021668/normal/1.jpg",
                                    "type": "lowres"
                                },
                                {
                                    "content": "http://kmb.raa.se/cocoon/bild/raa-image/16001000021668/thumbnail/1.jpg",
                                    "type": "thumbnail"
                                }
                            ]
                        },
                        "pres:itemLabel": "Visby",
                        "pres:organization": "Riksantikvarie\u00e4mbetet",
                        "pres:organizationShort": "RA\u00c4",
                        "pres:representations": {
                            "pres:representation": [
                                {
                                    "content": "http://kulturarvsdata.se/raa/kmb/rdf/16001000021668",
                                    "format": "RDF"
                                },
                                {
                                    "content": "http://kulturarvsdata.se/raa/kmb/xml/16001000021668",
                                    "format": "Presentation"
                                },
                                {
                                    "content": "http://kulturarvsdata.se/raa/kmb/html/16001000021668",
                                    "format": "HTML"
                                }
                            ]
                        },
                        "pres:service": "Kulturmilj\u00f6bild",
                        "pres:type": "Foto",
                        "pres:version": 1.11,
                        "xmlns:pres": "http://kulturarvsdata.se/presentation#"
                    },
                    "rel:score": {
                        "content": 5.375124,
                        "xmlns:rel": "info:srw/extension/2/relevancy-1.0"
                    }
                }
            ]
        },
        "totalHits": 1902,
        "version": 1
    }
}

''' Fetch from k-samsök '''
def fetchKsam(url):
    r = requests.get(url, headers={'Accept': 'application/json'})
    parsed = json.loads(r.content)
    for element in parsed["result"]["records"]["record"]:
        visionData = fetchGoogleVision(element["pres:item"]["pres:image"]["pres:src"][0]["content"])
        element.update({ "googleVision": {} })
        element["googleVision"].update(visionData)
        print(json.dumps(element, indent=4, sort_keys=True))
    return;

''' Fetch from Google Vision '''
def fetchGoogleVision(imgUrl):
    apiKey = 'AIzaSyAVjubBDQQdBMHZrqXmJUVyun6t0Lsb2Ho';
    visionUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey; 
    image = { "requests": [{ "image": { "source": { "imageUri": imgUrl } }, "features": [ { "type": "LABEL_DETECTION", "maxResults": 100 }, { "type": "IMAGE_PROPERTIES", "maxResults": 20 } ] }] }
    headers = {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }

    r = requests.post(visionUrl, headers=headers, json=image)
    parsed = json.loads(r.content)
    return parsed

def test():
    for element in par["result"]["records"]["record"]:
        element.update(testJson)
        print(json.dumps(element, indent=4, sort_keys=True))
    return

fetchKsam(url)