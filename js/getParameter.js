/*
   getParameter was fetched from the following URL on 2016-08-30:
   https://github.com/ryanburgess/get-parameter

   It was distributed with the following license:

   MIT © Ryan Burgess (http://github.com/ryanburgess)
*/
function getParameter(name){
  'use strict';
  var queryDict = {};
  var queries = location.search.substr(1).split('&');
  for (var i=0; i<queries.length; i++) {
    queryDict[queries[i].split('=')[0]] = decodeURIComponent(queries[i].split('=')[1]);
  } 

  // if name specified, return that specific get parameter
  if (name) {
    return queryDict.hasOwnProperty(name) ? decodeURIComponent(queryDict[name].replace(/\+/g, ' ')) : '';
  }

  return queryDict;
};
