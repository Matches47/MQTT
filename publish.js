//* 導入 MQTT 模塊依賴項 *//
var mqtt = require('mqtt');

//! 此頁註解只針對「發布(Publish)」說明，其餘說明請至 connection.js !//

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

    //@ 「發佈(Publish)」Method:publish( topic, message, option, callback ) @//

    //~ 訊息發佈設定(基本用法) Start ~//
    //? 基本訊息發佈 ?//
    //# 最簡易就是給「主題(topic)、訊息(message)」就能輕鬆發佈 #//
    client.publish("jdi/test/47", "Type your message here.");

    //# 養成好習慣，有 CallBack 都要使用 Function(error) 捕捉錯誤 #//
    client.publish("jdi/test/47", "Type your message here.", function(error) {
        if (error) {
            console.log(error);
        };
    });
    //~ 訊息發佈設定(基本用法) End ~//

    //+ 訊息發佈設定(進階) Start +//
    //# 進階也就是加上 'option' 設置，設置 QoS(連線品質) & Retain(訊息保留)，要用 JSON 格式 #//
    //# 如果都沒有設定的話，預設為 'qoS:0' & 'retain:false' #//
    //! QoS(連線品質)在 'subscribe.js' 有解說了，這裡不重複講解 !//
    //# Retain是設定該條訊息「是否保留」，使用 True & False 設定，默認為 False #//
    //# 如果設定為
    client.publish("jdi/test/47", "Type your message here.", { qos: 0, retain: false }, function(error) {
        if (error) {
            console.log(error);
        };
    });
    //+ 訊息發佈設定(進階) End +//
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
client.on('message', function(topic, message) {
    console.group(`-----  收到訂閱訊息  -----`);
    console.log('主題名稱: ' + topic);
    console.log('訊息內容: ' + message);
    console.groupEnd();
});
//- 接收訊息 End -//

//* 連線監聽 End *//