# fr24-decoder
**fr24-数据解析 websocket-发送**

#### 安装依赖
`npm install`
#### 使用说明
1. `radar(north, west, south, east) //获取输入经纬度范围内的数据`
2. `fetchData()` 选择需要的项目存储到`aPlane`,并暂存在`Plane`中
3. `socket.io` 设置 `http` 绑定 `9999` 端口
4. `sendMsg()` websocket 发送 `Plane` 数据
#### Data example
> **原始**
`"21c953db":["780A89",36.6881,114.8809,174,40100,523,"0046","T-F6M","B77W","B-KQU",1566462376,"JFK","HKG","CX831",0,0,"CPA831",0,"CPA"]`
>
> **输出**
`[{"hex":"c953db","flight":"CPA831","lon":114.8809,"lat":36.6881,"altitude":40100,"speed":523,"track":174}]`

**NodeJS 接收**
``` js
const io = require("socket.io-client");
let webSocket;

webSocket = io("http://localhost:9999", {
    path: "/flight"
});

webSocket.on("connect", () => {
    console.log("connected to ws:flight");
});

webSocket.on("flight", data => {
    console.log(data);
});

webSocket.on("error", err => {
    console.log("websocket err: " + err);
});
```
## Related
- [flightradar24-client](https://github.com/derhuerst/flightradar24-client)
**Fetch aircraft data from Flightradar24. Inofficial.**
- [socket.io](https://github.com/socketio/socket.io)
**Socket.IO enables real-time bidirectional event-based communication.**