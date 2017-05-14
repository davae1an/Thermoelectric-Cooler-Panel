var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database('../pyclient/data.db3');

db.serialize(function() {

  // var shouldinsert = false
  console.log('Creating Tables for SQlite3 Database if no Exists')
  db.run('PRAGMA foreign_keys = ON')
  db.run('CREATE TABLE IF NOT EXISTS pirecords (' +
    'rec_id INTEGER PRIMARY KEY, name TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)')
  db.run('CREATE TABLE IF NOT EXISTS pidata (' +
    'outside TEXT, inside TEXT, pump TEXT, date TEXT, rec_id INTEGER,' +
    'FOREIGN KEY(rec_id) REFERENCES pirecords(rec_id))')
  db.run('CREATE TABLE IF NOT EXISTS settingz (setname TEXT, value TEXT)')

  console.log('Checking settingz table')

  db.get('SELECT setname FROM settingz WHERE setname=(?)', 'lastrecord', function(err, row) {

    if (row == undefined) {
      console.log('lastrecord not found adding to table')
      db.serialize(function() {
        db.run('INSERT INTO settingz (setname, value) VALUES (?,?)', [
          'lastrecord', 'none'
        ], function(error) {
          if (error) {
            console.log('Cant insert data Error: ' + error)
          }
        })
      })

    } else {
      console.log('lastrecord exsists already')
    }

  })

  db.get('SELECT setname FROM settingz WHERE setname=(?)', 'currentrecord', function(err, row) {

    if (row == undefined) {
      console.log('currentrecord not found adding to table')
      db.serialize(function() {
        db.run('INSERT INTO settingz (setname, value) VALUES (?,?)', [
          'currentrecord', 'none'
        ], function(error) {
          if (error) {
            console.log('Cant insert data Error: ' + error)
          }
        })
      })
    } else {
      console.log('currentrecord exsists already')
    }

  })

  db.get('SELECT setname FROM settingz WHERE setname=(?)', 'recordData', function(err, row) {

    if (row == undefined) {
      console.log('recordData not found adding to table')
      db.serialize(function() {
        db.run('INSERT INTO settingz (setname, value) VALUES (?,?)', [
          'recordData', 'false'
        ], function(error) {
          if (error) {
            console.log('Cant insert data Error: ' + error)
          }
        })
      })
    } else {
      console.log('recordData exsists already')
    }

  })


  db.get('SELECT setname FROM settingz WHERE setname=(?)', 'interval', function(err, row) {

    if (row == undefined) {
      console.log('interval not found adding to table')
      db.serialize(function() {
        db.run('INSERT INTO settingz (setname, value) VALUES (?,?)', [
          'interval', '1'
        ], function(error) {
          if (error) {
            console.log('Cant insert data Error: ' + error)
          }
        })
      })
    } else {
      console.log('interval exsists already')
    }

  })

})

//Socket.io
io.on('connection', function(client) {
  console.log('User connected');

  client.on('join', function(data) {
    console.log(data);
    client.broadcast.emit('join', data)
  });

  client.on('gettemptarget', function(data) {
    client.broadcast.emit('gettemptarget', data)
  })

  client.on('tempdata', function(data) {
    client.broadcast.emit('tempdata', data)
  });

  client.on('changetemp', function(data) {
    client.broadcast.emit('changetemp', data)
    console.log(data)
  });

  client.on('targettemp', function(data) {
    client.broadcast.emit('targettemp', data)
  });

  client.on('picheck', function(data) {
    console.log('picheck: ' + data)
    client.broadcast.emit('picheck', data)

  });

  client.on('recordcheck', function(data) {
    //checks if recording data
    if (data == 'check') {
      console.log('picheck: ' + data)
      db.serialize(function() {
        console.log('Getting record data from database')
        db.all('SELECT setname, value FROM settingz', function(err, rows) {
          console.log(rows)
          client.broadcast.emit('recordinfo', rows)

        })
      })
    }
    client.broadcast.emit('picheck', data)

  });

  client.on('tempadd', function(data) {
    var jsondata = JSON.parse(data);
    var currentdate = jsondata.date;

    db.serialize(function() {})
    // temp : jsondata.temp,
    // time : jsondata.time

  });

  client.on('disconnect', function(data) {
    console.log('User disconnected:' + data);
  });
});

app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.send('SmartCooler Api')
})

app.get('/records', function(req, res) {
  db.all("SELECT * FROM pirecords", function(err, rows) {
    res.send(JSON.stringify(rows))
  });
})

app.get('/records/:id', function(req, res) {
  db.all("SELECT * FROM pirecords WHERE  rec_id=(?)", req.params.id, function(err, rows) {
    res.send(JSON.stringify(rows))
  });
})

app.post('/records/:name/:interval', function(req, res) {
  db.serialize(function() {
    db.run('INSERT INTO pirecords (name) VALUES (?)', req.params.name, function(error) {
      if (error) {
        console.log(error)
      }
    })
    db.run('UPDATE settingz SET value = (?) WHERE setname = (?)', [req.params.name, 'currentrecord'], function(error) {
      if (error) {
        console.log(error)
      }
    })
    db.run('UPDATE settingz SET value = (?) WHERE setname = (?)', [req.params.interval, 'interval'], function(error) {
      if (error) {
        console.log(error)
      }
    })
    db.run('UPDATE settingz SET value =' + 'true' + 'WHERE setname =(?)', 'RecordData', function(error) {
      if (error) {
        console.log(error)
      }
    })
  })

})



app.delete('/records/:id', function(req, res) {
  db.serialize(function() {
    db.run('DELETE FROM pidata WHERE rec_id=(?)', req.params.id, function(error) {
      if (error) {
        console.log(error)
      }
    })
    db.run('DELETE FROM pirecords WHERE rec_id=(?)', req.params.id, function(error) {
      if (error) {

        console.log(error)
      }
    })

  })
  res.send('deleted')
});


app.get('/pidata/:id', function(req, res) {
  db.all('SELECT * FROM pidata WHERE  rec_id=(?)', req.params.id, function(err, rows) {
    res.send(JSON.stringify(rows))
  });
})

app.get('/pidata', function(req, res) {
  db.all("SELECT * FROM pidata", function(err, rows) {
    res.send(JSON.stringify(rows))
  });
})


app.get('/settingz', function(req, res) {
  db.all("SELECT * FROM settingz", function(err, rows) {
    res.send(JSON.stringify(rows))
  });
})

http.listen(3000, function() {
  console.log('listening on *:3000');
})
