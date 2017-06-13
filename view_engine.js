var express = require('express');
var app = express();
var mysql = require('mysql');
var serialport = require("serialport"); 
var SerialPort = serialport.SerialPort;
var http = require('http');
var static = require('node-static');

//var io = require('socket.io').(http);

//------------ connect to Arduino-------------------


var port = new SerialPort("COM6", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\r\n")
});

port.on('open', function() {
  port.write('Bubble is on!', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('I am ready to receive message!');
  });
});

port.on('error', function(err) {
  console.log('Error: ', err.message);
})


//------------------- Database ----------------------

var connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'yaping',
    password:"yaping",
    database:'ya'
});

/*
connection.connect();

connection.query('SELECT * FROM question', function(err, rows, fields) {
    if (!err){
        console.log('Database connected!');
        
    }else{
        console.log('Error while performing Query.');
    }
});
connection.end();
*/

var askFood = 'SELECT Message FROM question WHERE Category="food"';

app.get('/food', function(req, res){
            connection.query(askFood, function(err, rows, fields){

            if(err){
                    console.log(err);
                    return;
            }
            if(rows.length > 0) {
                res.render('food', { rows: rows });
                
            }else{
                console.log('No data');
                res.render('food');
            }      
    });
});

var askSpot = 'SELECT Message FROM question WHERE Category="spot"';

app.get('/spot', function(req, res){
            connection.query(askSpot, function(err, rows, fields){

            if(err){
                    console.log(err);
                    return;
            }
            if(rows.length > 0) {
                res.render('spot', { rows: rows });
                
            }else{
                console.log('No data');
                res.render('spot');
            }      
    });
});

var askShop = 'SELECT Message FROM question WHERE Category="shopping"';

app.get('/shopping', function(req, res){
            connection.query(askShop, function(err, rows, fields){

            if(err){
                    console.log(err);
                    return;
            }
            if(rows.length > 0) {
                res.render('shopping', { rows: rows });
                
            }else{
                console.log('No data');
                res.render('shopping');
            }      
    });
});

var askRest = 'SELECT Message FROM question WHERE Category="rest"';

app.get('/rest', function(req, res){
            connection.query(askRest, function(err, rows, fields){

            if(err){
                    console.log(err);
                    return;
            }
            if(rows.length > 0) {
                res.render('rest', { rows: rows });
                
            }else{
                console.log('No data');
                res.render('rest');
            }      
    });
});

var askActivity = 'SELECT Message FROM question WHERE Category="activity"';

app.get('/activity', function(req, res){
            connection.query(askActivity, function(err, rows, fields){

            if(err){
                    console.log(err);
                    return;
            }
            if(rows.length > 0) {
                res.render('activity', { rows: rows });
                
            }else{
                console.log('No data');
                res.render('activity');
            }      
    });
});

var askFriend = 'SELECT Message FROM question WHERE Category="friend"';

app.get('/friend', function(req, res){
            connection.query(askFriend, function(err, rows, fields){

            if(err){
                    console.log(err);
                    return;
            }
            if(rows.length > 0) {
                res.render('friend', { rows: rows });
                
            }else{
                console.log('No data');
                res.render('friend');
            }      
    });
});

//---------------------------------------------------

var handlebars = require('express3-handlebars')
        .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname +'/public'));
app.use(require('body-parser')());

app.get('/', function(req, res){    
    res.render('start');
});

app.get('/ask', function(req, res){    
    res.render('ask_main');
    port.write('0');   //stop the display
});

app.get('/map', function(req, res){    
    res.render('map');
});

app.get('/profile', function(req, res){    
    res.render('profile');
});

app.post('/ask/write', function(req, res){
    message = req.body.message;
    res.render('ask_write', {message: message});  
});

app.get('/ask/write', function(req, res){
    res.render('ask_write');
    port.write('0');   //stop the display
});


app.post('/question', function(req, res){
    console.log('A citizen said : '+ req.body.message);
    message = req.body.message;
    res.render('post', {message: message});   //display the question 
    //send to serial port
    port.write(message + "     ");     //add "       " so that the messages won't mix together
    
    
    //insert to database
   
       var sql = "INSERT IGNORE INTO question (Message, Category) VALUES ('"+ req.body.message 
       +"', '"+ req.body.category +"')";
    
        connection.query(sql, function (err, result,fields) {
            if (err) throw err;
            console.log('1 message recorded');            
        });   
});


app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
               app.get('port') + '; press Ctrl-C to terminate.' );
    });