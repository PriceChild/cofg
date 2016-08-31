var weights = 0;
var lonmoments = 0;
var latmoments = 0;

var zfgweights = 0;
var zfg = {
    'lat': 0,
    'lon': 0,
}

var togwweights = 0;
var togw = {
    'lat': 0,
    'lon': 0,
}

var latcoordinates = [[95.5, -0.8], [95.5, 1], [98, 2.6], [101.5, 1.2], [101.5, -0.7], [97.5, -2.2], [97, -2.2]];
var loncoordinates = [[95.5, 920], [95.5, 1275], [96.5, 1370], [100, 1370], [101.5, 1175], [101.5, 920]];

/*
   pointinpolygon was fetched from the following URL on 2016-08-29:
   https://github.com/substack/point-in-polygon/blob/master/index.js

   It was distributed with the following license:

   The MIT License (MIT)

   Copyright (c) 2016 James Halliday

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
*/
function pointinpolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

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

var aircraft = {
    'r22': {
        'standard':{
            'bounds':{
                'lat': [[95.5, -0.8], [95.5, 1], [98, 2.6], [101.5, 1.2], [101.5, -0.7], [97.5, -2.2], [97, -2.2]],
                'lon': [[95.5, 920], [95.5, 1225], [96.5, 1300], [100, 1300], [101.5, 1130], [101.5, 920]],
            },
        },
        'hp': {
            get 'bounds' () {return aircraft['r22']['standard']['bounds'];},
        },
        'alpha':{
            'bounds':{
                'lat': [[95.5, -0.8], [95.5, 1], [98, 2.6], [101.5, 1.2], [101.5, -0.7], [97.5, -2.2], [97, -2.2]],
                'lon': [[95.5, 920], [95.5, 1275], [96.5, 1370], [100, 1370], [101.5, 1175], [101.5, 920]],
            },
        },
        'beta':{
            get 'bounds' () {return aircraft['r22']['alpha']['bounds'];},
        },
        'beta2':{
            get 'bounds' () {return aircraft['r22']['alpha']['bounds'];},
        },
    },
    'r44': {
        'astro':{
            'bounds':{
                'lat': [[92, -3], [92, 3], [100, 3], [102.5, 1.5], [102.5, -1.5], [100, -3]],
                'lon': [[92, 1550], [92, 2200], [93, 2400], [98, 2400], [102.5, 2000], [102.5, 1550]],
            },
        },
        'raven':{
            get 'bounds' () {return aircraft['r44']['astro']['bounds'];},
        },
        'raven2':{
            get 'bounds' () {return aircraft['r44']['astro']['bounds'];},
        },
    },
};

function updateAircraft() {
    var divobj = document.getElementById('models');
    var theForm = document.forms["balanceform"];
    var type = theForm.elements["type"].value;
    var typehtml = [];
    for (var model in aircraft[type]) {
        if (aircraft[type].hasOwnProperty(model)) {
            typehtml.push("<label>" + model + "</label><input type='radio' name='model' value='" + model + "' onchange='updateModel()'>");
        };
    };
    divobj.innerHTML = typehtml.join('\n');
};

function updateModel() {
    var theForm = document.forms["balanceform"];
    var type = theForm.elements["type"].value;
    var model = theForm.elements["model"].value;
    latcoordinates = aircraft[type][model]['bounds']['lat']
    loncoordinates = aircraft[type][model]['bounds']['lon']
    updatePage();
};

function updateTotals(latarm, lonarm, weight) {
    weights = weights + weight;
    lonmoments = lonmoments + lonarm*weight;
    latmoments = latmoments + latarm*weight;
};
function calculateTotals() {
    weights = 0;
    lonmoments = 0;
    latmoments = 0;

    var theForm = document.forms["balanceform"];

    var bem = parseFloat(theForm.elements["bem"].value);
    var latemptycofg = parseFloat(theForm.elements["latemptycofg"].value);
    var lonemptycofg = parseFloat(theForm.elements["lonemptycofg"].value);

    updateTotals(latemptycofg, lonemptycofg, bem);

    var dualsinstalled = theForm.elements["dualsinstalled"].checked;
    if(!dualsinstalled)
    {

        var dualsweight = -2.6;
        var dualslatarm = -12.88;
        var dualslonarm = 66.27;
        updateTotals(dualslatarm, dualslonarm, dualsweight);
    };

    var pilotweight = parseFloat(theForm.elements["pilot"].value);
    var pilotlatarm = 10.7;
    var pilotlonarm = 78;
    updateTotals(pilotlatarm, pilotlonarm, pilotweight);

    var passengerweight = parseFloat(theForm.elements["passenger1"].value);
    var passengerlatarm = -9.3;
    var passengerlonarm = 78;
    updateTotals(passengerlatarm, passengerlonarm, passengerweight);


    var leftdoorinstalled = theForm.elements["leftdoorinstalled"].checked;
    if(!leftdoorinstalled)
    {

        var doorweight = -5.2;
        var doorlatarm = 21;
        var doorlonarm = 77.5;
        updateTotals(doorlatarm, doorlonarm, doorweight);
    };

    var rightdoorinstalled = theForm.elements["rightdoorinstalled"].checked;
    if(!rightdoorinstalled)
    {

        var doorweight = -5.2;
        var doorlatarm = -21;
        var doorlonarm = 77.5;
        updateTotals(doorlatarm, doorlonarm, doorweight);
    };

    zfgweights = weights;
    zfg['lat'] = latmoments/weights;
    zfg['lon'] = lonmoments/weights;

    var divobj = document.getElementById('emptyCOFG');
    divobj.innerHTML = "Empty COFG: " + zfg['lon'].toFixed(2) + ", " + zfg['lat'].toFixed(2) + " - " + zfgweights + "lbs";

    var mainweight = parseFloat(theForm.elements["main"].value)*6;
    var mainlatarm = -11;
    var mainlonarm = 108.6;
    updateTotals(mainlatarm, mainlonarm, mainweight);

    var auxweight = parseFloat(theForm.elements["aux"].value)*6;
    var auxlatarm = 11.2;
    var auxlonarm = 103.8;
    updateTotals(auxlatarm, auxlonarm, auxweight);

    togwweights = weights;
    togw['lat'] = latmoments/weights;
    togw['lon'] = lonmoments/weights;

    var divobj = document.getElementById('fullCOFG');
    divobj.innerHTML = "Fueled COFG: " + togw['lon'].toFixed(2) + ", " + togw['lat'].toFixed(2) + " - " + togwweights + "lbs";

};
function calculateCoordinates(canvas, max, min, value){
    var realwidth = max-min;
    var realdiff = value-min;
    var alongpercentage = realdiff/realwidth;
    return alongpercentage*canvas;
};
function drawGraph(){

    var theForm = document.forms["balanceform"];
    var type = theForm.elements["type"].value;
    var model = theForm.elements["model"].value;

    for (var dimension of ['lat', 'lon']) {
        var c = document.getElementById(dimension + "canvas");
        var ctx = c.getContext("2d");

        ctx.clearRect(0, 0, c.width, c.height);

        var bounds = aircraft[type][model]['bounds'][dimension];

        var maxw = bounds[0][0];
        var minw = bounds[0][0];
        var maxh = bounds[0][1];
        var minh = bounds[0][1];
        for (var i=0, item; item=bounds[i]; i++) {
            var x = item[0];
            var y = item[1];
            if (x > maxw) {
                maxw = x;
            };
            if (x < minw) {
                minw = x;
            };
            if (y > maxh) {
                maxh = y;
            };
            if (y < minh) {
                minh = y;
            };
        };
        maxw = maxw + (maxw-minw)*0.05;
        minw = minw - (maxw-minw)*0.05;
        maxh = maxh + (maxh-minh)*0.05;
        minh = minh - (maxh-minh)*0.05;
        
        var canvaswidth = c.scrollWidth;
        var canvasheight = c.scrollHeight;

        ctx.beginPath();
        ctx.moveTo(calculateCoordinates(canvaswidth, maxw, minw, bounds[0][0]),calculateCoordinates(canvasheight, maxh, minh, bounds[0][1]));
        for (var i=1, coordinate; coordinate = bounds[i]; i++) {
            ctx.lineTo(calculateCoordinates(canvaswidth, maxw, minw, coordinate[0]),calculateCoordinates(canvasheight, maxh, minh, coordinate[1]));
        };
        ctx.closePath();
        ctx.stroke();

        if (dimension == 'lon'){
            var zfgy = zfgweights;
            var togwy = togwweights;
        } else {
            var zfgy = zfg['lat'];
            var togwy = togw['lat'];
        }
        ctx.beginPath();
        ctx.moveTo(calculateCoordinates(canvaswidth, maxw, minw, zfg['lon']),calculateCoordinates(canvasheight, maxh, minh, zfgy));
        ctx.lineTo(calculateCoordinates(canvaswidth, maxw, minw, togw['lon']),calculateCoordinates(canvasheight, maxh, minh, togwy));
        ctx.stroke();
    };
};
function checkLimits(){
    var inlimits = pointinpolygon([zfg['lon'], zfg['lat']], latcoordinates) && pointinpolygon([togw['lon'], togw['lat']], latcoordinates) && pointinpolygon([zfg['lon'], zfgweights], loncoordinates) && pointinpolygon([togw['lon'], togwweights], loncoordinates);
    var divobj = document.getElementById('inlimits');
    if(inlimits){
        divobj.innerHTML = "<div style='color:green'>All OK!</div>";
    } else {
        divobj.innerHTML = "<strong style='color:red'>Out of limits!!!</strong>";

    };
};
function bookmarkLink(){
    var theForm = document.forms["balanceform"];

    var divobj = document.getElementById('bookmark');
    var html = "Bookmark this link to save this aircraft's configuration: <a href='?"
    var items = ["bem", "latemptycofg", "lonemptycofg"]
    for (var i=0, item; item=items[i]; i++) {
        html = html + item + "=" + theForm.elements[item].value + "&"
    };
    html = html + "'>linky</a>";
    divobj.innerHTML = html;
};
function updatePage(){
    calculateTotals();
    drawGraph();
    checkLimits();
    bookmarkLink();
};
function pageLoad(){
    updateAircraft();
    var theForm = document.forms["balanceform"];
    var items = ["bem", "latemptycofg", "lonemptycofg", "pilot", "passenger1", "main", "aux", "dualsinstalled", "leftdoorinstalled", "rightdoorinstalled"]
    for (var i=0, item; item=items[i]; i++) {
        var value = getParameter(item);
        if(value){
            theForm.elements[item].value = value;
        };
    };
    updatePage();
};
