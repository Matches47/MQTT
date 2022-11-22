//* 導入 MQTT 模塊依賴項 *//
var mqtt = require('mqtt');

//* 連線設定 Start //
const connectUrl = `mqtt:192.168.1.217`;

const option = {
    port: 1883,
    clientID: 'nodejs',
    username: 'MQTT',
    password: 'MQTTPW'
};

const client = mqtt.connect(connectUrl, option);
//* 連線設定 End //


//* 連線監聽 Start *//

//- 連線成功 Start -//
client.on('connect', function() {
    console.group(`----- 連線已成功建立 -----`);
    console.log(`連線類型: ${connectUrl.split(':')[0]}`);
    console.log(`連線地址: ${connectUrl.split(':')[1]}`);
    console.groupEnd();
    //# 為了查看訊息有沒有成功發佈，所以訂閱一個與Publish主題相同的名稱 #//
    client.subscribe('jdi/test/47', function(err) {
        if (err) {
            console.log(err);
        };
    });

    client.publish("jdi/test/47", "Type your message here.");
});
//- 連線成功 End -//


//- 連線失敗 Start -//
client.on('error', function(err) {
    console.group(`----- 連線時發生錯誤 -----`);
    console.log(`[ 錯誤訊息-START ]`);
    console.log(err);
    console.log(`[ 錯誤訊息-END ]`);
    console.groupEnd();
});
//- 連線失敗 End -//


//- 接收訊息 Start -//

//@ 「訊息(Message)」Event:on.( 'message', function( topic, message, packet ){} ) @//

//! 基本的 'topic' & 'message' 已經使用很多次了，這裡不重複講解 !//
//# packet 是一個數據包，是這封訊息的詳細資料，console 看下面 #//
client.on('message', function(topic, message, packet) {
    console.group(`-----  收到訂閱訊息  -----`);
    console.log(packet);
    console.groupEnd();
});

//# console 長這樣 #//
//? Packet {
//?     cmd: 'publish',
//?     retain: false,
//?     qos: 0,
//?     dup: false,
//?     length: 36,
//?     topic: 'jdi/test/47',
//?     payload: <Buffer 54 79 70 65 20 79 6f 75 72 20 6d 65 73 73 61 67 65 20 68 65 72 65 2e>
//?   }

//# 白話文 #//
//~ Packet {
//~     cmd: 訊息類型
//~     retain: 訊息是否保留(True or False)
//~     qos: 傳輸品質(QoS:0、1、2)
//~     dup: 是否為副本或重傳(True or False)，QoS:0 必為 False
//~     length: Packet位元總長度 = 標頭(固定2位元)+主題名稱+訊息內容，以此訊息範例 2(表頭)+11(主題)+23(內容)=36(總長度)
//~     topic: 主題名稱
//~     payload: 訊息內容，格式為 <Buffer>
//~ }

//- 接收訊息 End -//

//* 連線監聽 End *//