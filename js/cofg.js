function clearForm() {
    for (var item of ["defaults", "loadingpoints", "fuel", "extras"]) {
        var divObj = document.getElementById(item);
        while (divObj.hasChildNodes()) {
            divObj.removeChild(divObj.lastChild);
        }
    };
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
    clearForm();
};

function updateModel() {
    var theForm = document.forms["balanceform"];
    var type = theForm.elements["type"].value;
    var model = theForm.elements["model"].value;

    clearForm();

    var defaults = document.getElementById('defaults');
    for (var item of ["bem", "lat", "lon"]) {
        defaults.appendChild(document.createTextNode(item + ":"));
        var input = document.createElement("input");
        input.type = "number";
        input.name = item;
        input.id = item;
        input.step = 0.1;
        input.setAttribute("onchange", "updatePage()");
        var value = getParameter(item);
        if(value && type == getParameter("type") && model == getParameter("model")){
            input.value = value;
        } else {
            input.value = aircraft[type][model]['defaults'][item];
        };
        defaults.appendChild(input);
    };

    var loadingpoints = document.getElementById('loadingpoints');
    for (var key in aircraft[type][model]['loadingpoints'] ) {
        loadingpoints.appendChild(document.createTextNode(key + ":"));
        var input = document.createElement("input");
        input.type = "number";
        input.name = key;
        input.id = key;
        input.max = aircraft[type][model]['loadingpoints'][key]['max'];
        input.setAttribute("onchange", "updatePage()");
        var value = getParameter(key);
        if(value){
            input.value = value;
        } else {
            input.value = aircraft[type][model]['loadingpoints'][key]['default'];
        };
        loadingpoints.appendChild(input);
    };

    var loadingpoints = document.getElementById('fuel');
    for (var key in aircraft[type][model]['fuel'] ) {
        fuel.appendChild(document.createTextNode(key + ":"));
        var input = document.createElement("input");
        input.type = "number";
        input.name = key;
        input.id = key;
        input.setAttribute("onchange", "updatePage()");
        var value = getParameter(key);
        if(value){
            input.value = value;
        } else {
            input.value = aircraft[type][model]['fuel'][key]['default'];
        };
        fuel.appendChild(input);
    };

    var loadingpoints = document.getElementById('extras');
    for (var key in aircraft[type][model]['extras'] ) {
        extras.appendChild(document.createTextNode(key + ":"));
        var input = document.createElement("input");
        input.type = "checkbox";
        input.name = key;
        input.id = key;
        input.setAttribute("onchange", "updatePage()");
        var value = getParameter(key);
        if(value){
            input.value = value;
        } else {
            input.checked = aircraft[type][model]['extras'][key]['includedinbem'];
        };
        extras.appendChild(input);
    };

    updatePage();
};

function addTableItem(item, weight, lonarm, latarm, celltype) {
    if (weight == 0) {
        return;
    };
    celltype = typeof celltype !== 'undefined' ? celltype : 'td';
    var table = document.getElementById('mnb');
    var tablerow = document.createElement('tr');

    var firstcolumn = true;
    for (var key of [item, weight, lonarm, latarm, lonarm*weight, latarm*weight]) {
        if (!firstcolumn) {
            key = key.toFixed(2);
        } else {
            firstcolumn = false;
        };
        var cell = document.createElement(celltype);
        cell.appendChild(document.createTextNode(key));
        tablerow.appendChild(cell);
    };
    table.appendChild(tablerow);
};

function calculateTotals() {
    var calculation = document.getElementById('calculation');
    while (calculation.hasChildNodes()) {
        calculation.removeChild(calculation.lastChild);
    };

    var table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('id', 'mnb');
    var tablerow = document.createElement('tr');
    for (var key of ["item", "weight", "lonarm", "latarm", "lonmoment", "latmoment"]) {
        var th = document.createElement('th');
        th.innerHTML = key;
        tablerow.appendChild(th);
    };
    table.appendChild(tablerow);
    calculation.appendChild(table);

    var theForm = document.forms["balanceform"];
    var type = theForm.elements["type"].value;
    var model = theForm.elements["model"].value;

    var bem = parseFloat(theForm.elements["bem"].value);
    var latemptycofg = parseFloat(theForm.elements["lat"].value);
    var lonemptycofg = parseFloat(theForm.elements["lon"].value);

    addTableItem("BEM", bem, lonemptycofg, latemptycofg);
    var weights = bem;
    var lonmoments = bem*lonemptycofg;
    var latmoments = bem*latemptycofg;

    for (var key in aircraft[type][model]['loadingpoints'] ) {
        item = aircraft[type][model]['loadingpoints'][key];
        value = parseFloat(theForm.elements[key].value);
        addTableItem(key, value, item['lon'], item['lat']);
        weights += value;
        lonmoments += value*item['lon'];
        latmoments += value*item['lat'];
    };

    for (var key in aircraft[type][model]['extras'] ) {
        item = aircraft[type][model]['extras'][key];
        if (!theForm.elements[key].checked === item['includedinbem']) {
            value = -item['weight'] // TODO: This negation needs checking...
            addTableItem(key, value, item['lon'], item['lat']);
            lonmoments += value*item['lon'];
            latmoments += value*item['lat'];
        };
    };

    var zfg = {};
    zfg['weight'] = weights;
    zfg['lon'] = lonmoments/weights;
    zfg['lat'] = latmoments/weights;
    addTableItem("ZFG", zfg['weight'], zfg['lon'], zfg['lat'], 'th');

    for (var key in aircraft[type][model]['fuel'] ) {
        item = aircraft[type][model]['fuel'][key];
        value = parseFloat(theForm.elements[key].value)*6; // USG -> LBS
        addTableItem(key, value, item['lon'], item['lat']);
        weights += value;
        lonmoments += value*item['lon'];
        latmoments += value*item['lat'];
    };

    var togw = {};
    togw['weight'] = weights;
    togw['lat'] = latmoments/weights;
    togw['lon'] = lonmoments/weights;
    addTableItem("TOGW", togw['weight'], togw['lon'], togw['lat'], 'th');

    return [zfg, togw];
};
function calculateCoordinates(canvas, max, min, value){
    var realwidth = max-min;
    var realdiff = value-min;
    var alongpercentage = realdiff/realwidth;
    return alongpercentage*canvas;
};
function drawGraph(zfg, togw){
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
        ctx.moveTo(calculateCoordinates(canvaswidth, maxw, minw, bounds[0][0]),canvasheight-calculateCoordinates(canvasheight, maxh, minh, bounds[0][1]));
        for (var i=1, coordinate; coordinate = bounds[i]; i++) {
            ctx.lineTo(calculateCoordinates(canvaswidth, maxw, minw, coordinate[0]),canvasheight-calculateCoordinates(canvasheight, maxh, minh, coordinate[1]));
        };
        ctx.closePath();
        ctx.stroke();

        if (dimension == 'lon'){
            var zfgy = zfg['weight'];
            var togwy = togw['weight'];
        } else {
            var zfgy = zfg['lat'];
            var togwy = togw['lat'];
        }
        ctx.beginPath();
        ctx.moveTo(calculateCoordinates(canvaswidth, maxw, minw, zfg['lon']),canvasheight-calculateCoordinates(canvasheight, maxh, minh, zfgy));
        ctx.lineTo(calculateCoordinates(canvaswidth, maxw, minw, togw['lon']),canvasheight-calculateCoordinates(canvasheight, maxh, minh, togwy));
        ctx.stroke();
    };
};
function checkLimits(zfg, togw){
    var theForm = document.forms["balanceform"];
    var type = theForm.elements["type"].value;
    var model = theForm.elements["model"].value;

    var latcoordinates = aircraft[type][model]['bounds']['lat']
    var loncoordinates = aircraft[type][model]['bounds']['lon']

    var inlimits = pointinpolygon([zfg['lon'], zfg['lat']], latcoordinates) && pointinpolygon([togw['lon'], togw['lat']], latcoordinates) && pointinpolygon([zfg['lon'], zfg['weight']], loncoordinates) && pointinpolygon([togw['lon'], togw['weight']], loncoordinates);
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
    var items = ["type", "model", "bem", "lat", "lon"]
    for (var i=0, item; item=items[i]; i++) {
        html = html + item + "=" + theForm.elements[item].value + "&"
    };
    html = html + "'>linky</a>";
    divobj.innerHTML = html;
};
function updatePage(){
    var cog = calculateTotals();
    var zfg = cog[0];
    var togw = cog[1];
    drawGraph(zfg, togw);
    checkLimits(zfg, togw);
    bookmarkLink();
};
function pageLoad(){
    var divobj = document.getElementById('types');
    var typehtml = [];
    for (var type in aircraft) {
        if (aircraft.hasOwnProperty(type)) {
            typehtml.push("<label>" + type + "</label><input type='radio' name='type' value='" + type + "' onchange='updateAircraft()'>");
        };
    };
    divobj.innerHTML = typehtml.join('\n');

    var theForm = document.forms["balanceform"];
    var value = getParameter("type");
    if(value){
        theForm.elements["type"].value = value;
        updateAircraft();
        var theForm = document.forms["balanceform"];
        var value = getParameter("model");
        if(value){
            theForm.elements["model"].value = value;
            updateModel();
        };
    };
};
