var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose()
var squel = require("squel");

var db = new sqlite3.Database('../pyclient/data.db3');

db.serialize(function() {

  // var shouldinsert = false
  console.log('Creating Tables for SQlite3 Database if no Exists')
  db.run('PRAGMA foreign_keys = ON')
  db.run('CREATE TABLE IF NOT EXISTS pirecords (' +
    'rec_id INTEGER PRIMARY KEY, name TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)')
  db.run('CREATE TABLE IF NOT EXISTS pidata (' +
    'outside TEXT, inside TEXT, pump TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP, rec_id INTEGER,' +
    'FOREIGN KEY(rec_id) REFERENCES pirecords(rec_id))')
  db.run('CREATE TABLE IF NOT EXISTS settingz (setname TEXT, value TEXT)')

  console.log('Checking settingz table')

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

  db.get('SELECT setname FROM settingz WHERE setname=(?)', 'mode', function(err, row) {

    if (row == undefined) {
      console.log('mode not found adding to table')
      db.serialize(function() {
        db.run('INSERT INTO settingz (setname, value) VALUES (?,?)', [
          'mode', 'high'
        ], function(error) {
          if (error) {
            console.log('Cant insert data Error: ' + error)
          }
        })
      })
    } else {
      console.log('mode exsists already')
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

  db.get('SELECT setname FROM settingz WHERE setname=(?)', 'recordid', function(err, row) {

    if (row == undefined) {
      console.log('recordid not found adding to table')
      db.serialize(function() {
        db.run('INSERT INTO settingz (setname, value) VALUES (?,?)', [
          'recordid', '0'
        ], function(error) {
          if (error) {
            console.log('Cant insert data Error: ' + error)
          }
        })
      })
    } else {
      console.log('recordid exsists already')
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
    console.log('send record check')
    client.broadcast.emit('picheck', data)
    client.emit('changerecord', 'check')

  });

  client.on('tempadd', function(data) {
    var jsondata = JSON.parse(data);
    console.log('adding tempdata')
    db.serialize(function() {
      db.run('INSERT INTO pidata (outside, inside, pump, rec_id) VALUES ((?),(?),(?),(?))', [jsondata.tempinside, jsondata.tempoutside, jsondata.temphousing, jsondata.recordId], function(error) {
        if (error) {
          console.log(error)
        }
      })

    })


  });

  client.on('disconnect', function(data) {
    console.log('User disconnected:' + data);
  });

  client.on('mode', function(data) {


    db.serialize(function() {
      db.run('UPDATE settingz SET value =(?) WHERE setname =(?)', [data, 'mode'], function(error) {
        if (error) {
          console.log(error)
        }
      })
    })

    client.broadcast.emit('mode', '{' + data + '}')

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
      } else {


        db.run('UPDATE settingz SET value =(?) WHERE setname =(?)', [this.lastID, 'recordid'], function(error) {
          if (error) {
            console.log(error)
          }
        })


        console.log('the insert id is:')
        console.log(this.lastID)
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

    res.send('added')
    io.emit('record', '{True}')
  })

})



app.delete('/records/:id', function(req, res) {
  db.serialize(function() {


    db.get('SELECT value FROM settingz WHERE setname=(?)', 'recordid', function(err, row) {
      console.log('The row to delete: ' + row)
      if (row.value == req.params.id) {
        console.log('record is currently being recorded cannot delete')
        res.send('stopfirst')
      } else {
        res.send('deleted')
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
      }

    })


  })
});


app.put('/recordcmd/:cmd', function(req, res) {
  if (req.params.cmd == 'stop') {

    io.emit('record', '{False}')

    db.serialize(function() {

      db.run('UPDATE settingz SET value = (?) WHERE setname = (?)', ['none', 'currentrecord'], function(error) {
        if (error) {
          console.log(error)
        }
      })
      db.run('UPDATE settingz SET value = (?) WHERE setname = (?)', ['1', 'interval'], function(error) {
        if (error) {
          console.log(error)
        }
      })
      db.run('UPDATE settingz SET value =(?) WHERE setname =(?)', ['False', 'RecordData'], function(error) {
        if (error) {
          console.log(error)
        }
      })

      db.run('UPDATE settingz SET value =(?) WHERE setname =(?)', ['0', 'recordid'], function(error) {
        if (error) {
          console.log(error)
        }
      })
    })




    res.send('stopped')
  } else {
    res.send('failed')
  }

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
