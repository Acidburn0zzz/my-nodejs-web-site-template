var express = require('express');
var path = require('path');
var stylus = require('stylus');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var  mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str, path) {
    return stylus(str).set('filename ', path);
}

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
}));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://wasya:mymongodb@ds033390.mongolab.com:33390/mymongodb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open',function callback() {
    console.log('my db opened on mongolab');
});
var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne({}).exec(function(err, messageDoc) {
    mongoMessage = messageDoc.message;
});


app.get('/partials/:partialPath', function(req, res) {
    res.render('partials/' + req.params.partialPath);
});

app.get('*', function(req, res) {
    res.render('index', {
        mongoMessage: mongoMessage
    });
});

var port = 3000;
app.listen(port);
console.log('Listening on port ' + port + '...');