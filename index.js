const fs = require('fs');
const express = require('express');

const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const sjcl = require('sjcl');
const request = require('request');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('', function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

let temp_url = "";

app.post('/get', function (req, res) {
  const url = req.body.url;

  let opts = {
    url : url
  };

  request.get(opts, function (error, response, body) {
    if (error) {
      throw error;
    }

    res.send(response.statusCode);
  });
});

app.post('/make', function (req, res) {
  const url = req.body.url;
  let code = req.body.code;

  if (code === "" || code === null || code === undefined) {
    code = "default";
  }

  if (url.toLowerCase() === temp_url) {
    res.send("limit");
  }

  else {
    let darArr = [];
    let largusArr = [];
    
    fs.readFile('hoka.txt', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      
      darArr = data.split(",");
    });

    fs.readFile('Largus.txt', 'utf8', function (err, data) {
      if (err) {
        throw err;
      }

      else {
        largusArr = data.split(",");
      }
    });

    darArr.push(sjcl.encrypt(code, url));
    largusArr.push(url);
    
    fs.writeFile('hoka.txt', String(darArr), function (err) {
      if (err) {
        throw err;
      }

      res.send("success");
    });

    fs.writeFile('Largus.txt', String(largusArr), function (err) {
      if (err) {
        throw err;
      }
    });
  }
});

setInterval(function () {
  temp_url = "";

  let hokaText = [];

  fs.readFile('Largus.txt', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    else {
      hokaText = data.split(",");
    }
  });

  for (i = 0; i < hokaText.length; i++) {
    let opts = {
      url : hokaText[i]
    };

    console.log(hokaText[i]);

    if (hokaText[i] === null || hokaText[i] === undefined || hokaText[i] === "") {
      // do nothing
    }

    else {
      request.get(opts, function (error, response, body) {
        if (error) {
          throw error;
        }

        console.log(response.statusCode);
      });

      console.log("VALID ABOVE");
    }
  }
}, 60000);

http.listen(port, function(){
  console.log('listening on *:' + port);
});