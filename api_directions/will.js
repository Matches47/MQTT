//* 導入 MQTT 模塊依賴項 *//
const mqtt = require("mqtt");

//* 連線設定 Start *//
const connectUrl = `mqtt:127.0.0.1`;

const option = {
    port: 1883,
    clean: true,
    clientId: "testAccount",
    username: "MQTT",
    password: "MQTTPW",

    //+ 遺囑訊息 Start +//
    will: {
        topic: "testAccount-will",
        payload: "offline",
        QoS: "",
        retain: "true",
    },
    //+ 遺囑訊息 End +//
};

const client = mqtt.connect(connectUrl, option);
//* 連線設定 End *//

//* 連線監聽 Start *//

//- 連線成功 Start -//
client.on("connect", function () {
    console.group(`----- 連線已成功建立 -----`);
    console.log(`連線類型: ${connectUrl.split(":")[0]}`);
    console.log(`連線地址: ${connectUrl.split(":")[1]}`);
    //~ 訊息訂閱設定 Start ~//
    //# 這裡不用訂閱主題，直接使用﹝MQTT Explorer﹞或是類似的程式監看 #//
    // client.subscribe('jdi/test/04', function(err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(`已訂閱主題: topicName`);
    //         console.groupEnd();
    //     }
    // });
    //~ 訊息訂閱設定 End ~//
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
    console.log("主題名稱: " + topic);
    console.log("訊息內容: " + message);
    console.groupEnd();
});
//- 接收訊息 End -//

//- 假定發報 Start -//

//# 發布一個主題(名字隨意)，訊息內容打上 'Alive'，為了判斷目前狀態 #//
client.publish("testAccount", "Alive", function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Published");
    }
});

//# 發布一個主題(名字同上+will)，訊息內容打上 'online'，為了判斷目前狀態 #//
client.publish("testAccount-will", "online", function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Published");
        client.on("close", function () {
            console.log("Disconnected");
        });
    }
});
//- 假定發報 End -//

//* 連線監聽 End *//
