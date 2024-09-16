const JsonFileName = "alltext.json";
const express = require('express');
const fs = require('fs');
const url = require('url');

var app = express();

app.use(express.static('public'));

app.use("/postText", function (req, res, next) {
    jsonStr = req.get('data');
    var jsonObj = JSON.parse(jsonStr);
    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile(JsonFileName, function (err, data) {
        if (err) {
            fs.open(JsonFileName, 'w', function (err, fh) {
                if (err) {
                    console.log("file error=>" + err.message);
                    return res.end("file ERROR=>" + err.message);
                }
                fs.close(fh, function (e, f) {
                    if (e) {
                        throw e;
                    }
                    console.log("file has been closed");
                    res.write("ERORR try again");
                    return res.end();
                });
            });
        }
        console.log("data is =>" + data);
        if (data.length > 0) {
            console.log("hh1 =>" + data);
            jsonAlltextObj = JSON.parse(data);
            if (Number.isFinite(jsonAlltextObj)) {
                jsonAlltextObj = {};
            }
        } else {
            console.log("hh2");
            jsonAlltextObj = {};
        }
        console.log("hh3");
        console.log("before");
        console.log(jsonAlltextObj);
        jsonAlltextObj[jsonObj.date.toString()] = jsonObj.text.toString();
        console.log("after");
        console.log(jsonAlltextObj);
        newData = JSON.stringify(jsonAlltextObj);
        fs.writeFile(JsonFileName, newData, function (err, data) {
            if (err)
                throw err;
            console.log("req => " + jsonObj.text + "," + jsonObj.date + ' => Saved!');
            res.write("req => " + jsonObj.text + "," + jsonObj.date);
            return res.end();
        });
    });

});
app.use("/getText", function (req, res, next) {
    var outRead = "";
    res.writeHead(200, {'Content-Type': 'text/json'});
    fs.readFile(JsonFileName, function (err, data) {
        if (err) {
            console.log("file error=>" + err.message);
            return res.end("file ERROR=>" + err.message);
        }
        console.log("data is:" + data);
        if (data.length > 0) {
            console.log("here1");
            jsonAlltextObj = JSON.parse(data);
            if (Number.isFinite(jsonAlltextObj)) {
                jsonAlltextObj = {};
            }
        } else {
            console.log("here2");
            jsonAlltextObj = {};
        }
        console.log("here3");
        console.log(jsonAlltextObj);
        outRead = JSON.stringify(jsonAlltextObj);
        res.write(outRead);
        return res.end();
    });

});
app.use(function (req, res, next) {
    console.log("req.url=>" + req.url);

    var q = url.parse(req.url, true);
    if (req.url !== '/') {
        targetPageName = q.pathname + ".html";
    } else {
        targetPageName = 'index.html';
    }
    var filename = "views/" + targetPageName;
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });

    console.log(q.host); //returns 'localhost:8080'
    console.log(q.pathname); //returns '/default.htm'
    console.log(q.search); //returns '?year=2017&month=february'

    var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
    console.log(qdata.month); //returns 'february'
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.write(err.message);
    console.log(err.message);
});

module.exports = app;
