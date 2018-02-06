var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('enter room', function(msge){
        console.log('message: ' + msge);

        // 実行時間を追加
        var data = JSON.stringify({msg:msge+'が入室しました',type:'enter'});
        var data = JSON.parse(data);
        var d = new Date();
        data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        data = JSON.stringify(data);
        console.log('\033[96m' + data + '\033[39m');

        io.emit('send message', data);
    });
    
    socket.on('typing now', function(user){
        io.emit('typing now', user+" is typing");
    });
    socket.on('typing end', function(user){
        io.emit('typing end', "");
    });
    
    socket.on('chat message', function(data){
        
        var data = JSON.parse(data);
        var d = new Date();
        data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        //io.emit('receive message', );
        data.msg = data.user+"<br>"+data.msg;
        data = JSON.stringify(data);
        console.log('\033[96m' + data + '\033[39m');
        io.emit('send message', data);

    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
