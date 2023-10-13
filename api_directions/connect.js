//* 導入 MQTT 模塊依賴項 *//
const mqtt = require("mqtt");

//* 連線設定 Start *//

//~ 訊息發佈設定(基本用法) Start ~//
//# 設定 MQTT broker 的 URL，這裡使用的 Host 'test.mosquitto.org' 是開源測試 Broker #//
//# 如果已經有架設好自己的 Broker 可以改成自己的 Host 做測試 #//
const connectUrl = `mqtt:test.mosquitto.org`;
const client = mqtt.connect(connectUrl);

//~ 訊息發佈設定(基本用法) End ~//

//! 想知道如何架設 Broker 請參閱文件 'MQTT Broker.pdf' !//

//+ 訊息發佈設定(進階) Start +//
//# 進階也就是加上 'options' 設置 #//
//# 使用非匿名連線才需要設定 username & password，若使用匿名連線請刪除或註解 #//
// const connectUrl = `mqtt:127.0.0.1`;
// const options = {
//     port: 1883,
//     clientId: "nodejs",
//     username: "MQTT",
//     password: "MQTTPW",
// };
// const client = mqtt.connect(connectUrl, options);
//+ 訊息發佈設定(進階) End +//

//* 連線設定 End *//

//* 連線監聽 Start *//

//- 連線成功 Start -//
client.on("connect", function () {
    console.group(`----- 連線已成功建立 -----`);
    console.log(`連線類型: ${connectUrl.split(":")[0]}`);
    console.log(`連線地址: ${connectUrl.split(":")[1]}`);
    //+ 訊息訂閱設定 Start +//
    //! 此頁只訂閱單筆主題，訂閱多筆主題及更多「訂閱(Subscribe)」說明請至 subscribe.js !//
    //# 'subscribe' 要放在 'connect' 底下執行 #//
    //# 'topicName' 為訂閱主題名稱，格式為字串 #//
    client.subscribe("jdi/test/+", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`已訂閱主題: topicName`);
            console.groupEnd();
        }
    });
    //+ 訊息訂閱設定 End +//
});
//- 連線成功 End -//

//- 連線失敗 Start -//
client.on("error", function (err) {
    console.group(`----- 連線時發生錯誤 -----`);
    console.log(`[ 錯誤訊息-START ]`);
    console.log(err);
    console.log(`[ 錯誤訊息-END ]`);
    console.groupEnd();
});
//- 連線失敗 End -//

//- 接收訊息 Start -//
client.on("message", function (topic, message) {
    console.group(`-----  收到訂閱訊息  -----`);
    console.log(message);
    console.log("主題名稱: " + topic);
    console.log("訊息內容: " + message);
    console.groupEnd();
});
//- 接收訊息 End -//

//* 連線監聽 End *//
