//* 導入 MQTT 模塊依賴項 *//
const mqtt = require('mqtt');

//* 連線設定 Start *//
const connectUrl = `mqtt:192.168.1.217`

const option = {
    port: 1883,
    // clean: true,
    clientId: 'nodejs',
    //# 使用非匿名連線才需要設定 username & password，若使用匿名連線請刪除或註解 -//
    username: 'MQTT',
    password: 'MQTTPW',
};

const client = mqtt.connect(connectUrl, option);
//* 連線設定 End *//


//* 連線監聽 Start *//

//- 連線成功 Start -//
client.on('connect', function() {
    console.group(`----- 連線已成功建立 -----`);
    console.log(`連線類型: ${connectUrl.split(':')[0]}`);
    console.log(`連線地址: ${connectUrl.split(':')[1]}`);
    //+ 訊息訂閱設定 Start +//
    //! 此頁只訂閱單筆主題，訂閱多筆主題及更多「訂閱(Subscribe)」說明請至 subscribe.js !//
    //# 'subscribe' 要放在 'connect' 底下執行 #//
    //# 'topicName' 為訂閱主題名稱，格式為字串 #//
    client.subscribe('jdi/test/+', function(err) {
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
    console.log(message);
    console.log('主題名稱: ' + topic);
    console.log('訊息內容: ' + message);
    console.groupEnd();
});
//- 接收訊息 End -//

//* 連線監聽 End *//