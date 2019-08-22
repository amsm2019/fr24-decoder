// radar
const radar = require('flightradar24-client/lib/radar')
// websocket server
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    path: '/flight'
});
let Planes = []
// let aPlane ={
//     "hex": "",
//     "flight": "",
//     "lat": 0.0,
//     "lon": 0.0,
//     "altitude": 0,
//     "speed": 0.0,
//     "track": 0
// }
// 获取飞机数据
function fetchData() {
    /******************************************************************************************
        // 获取当前窗口坐标
        let bounds = transformExtent(defaultView.calculateExtent(), "EPSG:3857", "EPSG:4326")
        getFlight(bounds[3],bounds[0],bounds[1],bounds[2])// north, south, west, east
    *******************************************************************************************/
    // 获取 (46.14, 87.95, 23.33, 136.16) 范围内 数据
    radar(46.14, 87.95, 23.33, 136.16)
        .then((flights) => {
            for (var i in flights) {
                let aFlight = flights[i];
                // Planes[aFlight.id] = aFlight //flight.id为索引
                let aPlane = {};
                aPlane.hex = aFlight.id.substring(2)
                aPlane.flight = aFlight.callsign
                aPlane.lon = parseFloat(aFlight.longitude)
                aPlane.lat = parseFloat(aFlight.latitude)
                aPlane.altitude = parseInt(aFlight.altitude)
                aPlane.speed = parseInt(aFlight.speed)
                aPlane.track = parseInt(aFlight.bearing)
                Planes.push(aPlane)
            }
            sendMsg()
        })
        .then(console.log)
        .catch(console.error)
}
// sendMsg 
function sendMsg() {
    let msg = JSON.stringify(Planes)
    console.log("!*numbers:" + msg.length)
    if (msg.length > 1) {
        io.emit('flight', msg);
    }
    Planes = []
}
// websocket server
io.on('connection', (socket) => {
    console.log(`ws - 用户连入, ${socket.handshake.address}`);
    socket.on('disconnect', () => {
        console.log(`ws - 用户断开, ${socket.handshake.address}`);
    });
});
// websocket:localhost:9999/flight
http.listen(9999, function () {
    console.log(`listening on: 9999`);
});
// 间隔 2.5s 获取一次
setInterval(function () {
    fetchData();
}, 2500);