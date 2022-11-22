//* 導入 MQTT 模塊依賴項 *//
const mqtt = require('mqtt');

//* 連線設定 Start *//
const connectUrl = `mqtt:192.168.1.217`;

const option = {
    port: 1883,
    clean: true,
    clientId: 'nodejs',
    username: 'tosoh_mqtt',
    password: 'tosoh_pwd',
};

const client = mqtt.connect(connectUrl, option);
//* 連線設定 End *//


//* 連線監聽 Start *//

//- 連線成功 Start -//
client.on('connect', function() {
    console.group(`----- 連線已成功建立 -----`);
    console.log(`連線類型: ${connectUrl.split(':')[0]}`);
    console.log(`連線地址: ${connectUrl.split(':')[1]}`);
    console.groupEnd();

    //~ 訊息訂閱設定(基本用法) Start ~//
    client.subscribe('topicName', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`已訂閱主題: topicName`);
            console.groupEnd();
        }
    });
    //~ 訊息訂閱設定(基本用法) End ~//


    //+ 訊息訂閱設定(進階用法) Start +//
    //@ Method:subscribe( topic, option, callback ) @//

    //? 訂閱多個主題(陣列) ?//
    //# 'topic' 可以使用﹝陣列﹞方式包進多個主題來同時訂閱 #//
    client.subscribe(['topicX', 'topicY', 'topicZ'], function(err) {
        if (err) {
            console.log(err);
        } else {
            console.group(`----- 已訂閱以下主題 -----`);
            console.log('topicX & topicY & topicZ');
            console.groupEnd();
        };
    });


    //? 訂閱多個主題(階層) ?//
    //# 'topic' 可以使用﹝階層﹞方式訂閱多個主題 #//
    //# 以上方範例來說，三個主題共同有 'topic'，就可以將主題使用階層命名，主題階層的分隔字元為 '/' #//
    //# 重新命名後變成 'topic/X', 'topic/Y', 'topic/Z'，只要訂閱主題 'topic/+' 就可以收到 X.Y.Z 三個主題的訊息了 #//
    //# 階層命名中不可包含 # 和 + 字元，因為是特殊字元，'+' 是代表一個階層的所有 #//
    //# 如以下範例 'topic/+' 所代表的是訂閱 'topic' 階層底下第一個階層的所有主題 #//
    client.subscribe('topic/+', function(err) {
        if (err) {
            console.log(err);
        }
    });
    //- 主題 'topic/X' 發布訊息，可以收到。 -//
    //- 主題 'topic/X/1' 發布訊息，無法收到。 -//

    //# 特殊字元 '#'，是代表所有階層，如果訂閱主題 'topic/#' 可以收到 'topic' 階層底下的所有主題 #//
    client.subscribe('topic/#', function(err) {
        if (err) {
            console.log(err);
        }
    });
    //- 主題 'topic/X' 發布訊息，可以收到。 -//
    //- 主題 'topic/X/1' 發布訊息，可以收到。 -//
    //- 主題 'topic/X/1/2/3' 發布訊息，可以收到。 -//
    //- 主題 'topic/X/1/2/3/?/?/?/?/?/?/?' 發布訊息，也可以收到。 -//

    //# 當然如果話說回一開始的主題 'topicX', 'topicY', 'topicZ'，不想要改成階層式命名 #//
    //# 也可以直接訂閱主題 '#'，這樣傳送到你指定連線的﹝MQTT Broker﹞內的所有訊息你都會收到 #//
    client.subscribe('#', function(err) {
        if (err) {
            console.log(err);
        }
    });
    //- 什麼鬼都會收到 -//


    //? 連線品質(QoS) ?//
    //@ QoS代表發布者與代理人，或者代理人與訂閱者之間的傳輸品質。MQTT定義了0, 1和2三個層級的品質設定 @//
    //@ 0：最多傳送一次（at most once） 1：至少傳送一次（at least once） 2：確實傳送一次（exactly once） #//
    //# 因為一般情況都是使用 'Qos:0'，所以這裡不多贅述，如果想多了解，傳送門在此: https://swf.com.tw/?p=1015 #//
    //# 'QoS' 可以統一在 'option' 的欄位設定，要使用﹝JSON﹞格式，如果都沒有設定的話，預設為 'Qos:0' #//
    client.subscribe(['topicX', 'topicY', 'topicZ'], { qos: 0 }, function(err) {
        if (err) {
            console.log(err);
        }
    });

    //- 輸出結果 { topic:'topicX', qos:0 }, { topic:'topicY', qos:0 }, { topic:'topicZ', qos:0 } -//


    //# 如果訂閱的主題需要設定不同的連線品質，也可以直接在 'topic' 欄位個別設定， 'option' 欄位就不需要 #//
    client.subscribe({ 'topicX': { qos: 0 }, 'topicY': { qos: 1 }, 'topicZ': { qos: 2 } }, function(err) {
        if (err) {
            console.log(err);
        }
    });

    //- 輸出結果 { topic:'topicX', qos:0 }, { topic:'topicY', qos:1 }, { topic:'topicZ', qos:2 } -//


    //? 連線品質授權(Granted) ?//
    //# 這裡簡單來說就是提供 'console.log'，可以印出 'topic', 'qos' #//
    client.subscribe(['topicX', 'topicY', 'topicZ'], { qos: 0 }, function(err, granted) {
        console.log(granted);
    });

    //- 輸出結果 [{ topic: 'topicX', qos: 0 },{ topic: 'topicY', qos: 0 },{ topic: 'topicZ', qos: 0 }] -//

    //# 知道如何 'console.log' 就將上面練習一次吧 #//

    //+ 訊息訂閱設定(進階用法) End +//

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