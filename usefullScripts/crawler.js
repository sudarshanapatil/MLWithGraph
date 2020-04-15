let recipeUrls=[
  'https://www.bbcgoodfood.com/recipes/2303681/creamy-courgette-and-bacon-pasta-',
  'https://www.bbcgoodfood.com/recipes/creamy-tomato-courgette-prawn-pasta'
]

var fs = require('fs');
var cheerio = require('cheerio');
var inputFile ='./testHtml.html';
var outputPath= './output/';
var tagAttr = 'javascript';
const express = require('express')
const morgan = require('morgan')
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(
  'bolt://localhost:11002',
  neo4j.auth.basic('neo4j', 'sudri@123')
)
var request = require('request');

const json_beautifier = require('csvjson-json_beautifier');
console.log("Connected to neo4j")
const cors = require('cors')
const session = driver.session();

console.log("The file '" + inputFile + "' will be processed.");
console.log("The path '" + outputPath + "' will be the output directory.");

request('https://www.bbcgoodfood.com/recipes/2303681/creamy-courgette-and-bacon-pasta-', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
  extractScripts(body);
});

function extractScripts(data) {
  //console.log(data)
	var $ = cheerio.load(data);
	$('script').each(function(i, element){
    let recipeData
    if($(this)['0']['children']['0'])
    {
    if($(this)['0']['children']['0']['data'].includes("recipe:{"))
    { 
       recipeData=$(this)['0']['children']['0']['data']
       console.log(recipeData,"data to process")
       let startIndex=recipeData.indexOf('{article:')
       let lastIndex=recipeData.indexOf('}});')
       console.log(startIndex,lastIndex)
       let finalData=`${recipeData.substring(startIndex,lastIndex)}}`
       const json = json_beautifier(finalData,{});
       //console.log(json,typeof json)
       let obj=JSON.parse(json)
       console.log(obj,typeof obj)
    }
    }
   });
}
//based on similarity of user interest
//add user nodes user->rates[recipe]