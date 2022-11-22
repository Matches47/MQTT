const encodingConvert = require('encoding');

//# 解碼(GBK轉UTF8) #//
const plateDecoded = encodingConvert.convert(msg, "UTF8", "GBK");

console.log(plateDecoded.toString());