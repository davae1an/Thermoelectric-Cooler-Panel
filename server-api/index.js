var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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


    // console.log('Send the data to record')
    // {} sign is used to help parse data on client side
    // client.emit('join', 'Testing transfer Finallyyssssssssssssssssss')

    client.on('tempdata', function(data) {
        // var jsondata = JSON.parse(data);
        // console.log('Temp: ' + data)
        client.broadcast.emit('tempdata', data)
    });

    client.on('targettemp', function(data) {
        // var jsondata = JSON.parse(data);
        // console.log('Temp: ' + data)
        client.broadcast.emit('targettemp', data)
    });

    client.on('tempadd', function(data) {
        var jsondata = JSON.parse(data);
        var currentdate = jsondata.date;
        var document = {
            id: 'tempData',
            data: {
                currentdate: [{
                    temp: jsondata.temp,
                    time: jsondata.time
                }]

            }
        }

        // bucket.upsert('tempData', document, function(error, result) {
        //     if (error) {
        //         return console.log('Error Data not sent to database')
        //     }
        //     // res.send(result);
        // });



    });

    client.on('disconnect', function() {
        console.log('User disconnected');
    });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// app.get('/temp/:id', function(req, res) {
//     bucket.get(req.params.id, function(error, result) {
//         if (error) {
//             return res.status(400).send(error);
//         }
//         res.send(result);
//     });
// });


// app.post('/temp/:id', function(req, res) {

//     var document = {
//         id: req.body.id,
//         data: req.body.data
//     }
//     bucket.upsert(req.params.id, document, function(error, result) {
//         if (error) {
//             return res.status(400).send(error);
//         }
//         res.send(result);
//     });
// });



app.get('/', function(req, res) {
    res.send('SmartCooler Api')
})


app.get('/user', function(req, res) {
    res.send('User end point')
})

http.listen(3000, function() {
    console.log('listening on *:3000');
});
