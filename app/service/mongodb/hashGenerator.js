var MD5 = require("crypto-js/md5");

module.exports = {
    generateHash: function(url) {
        // console.log(url);
        // console.log(MD5(url).toString());
        hashKey = MD5(url).toString();
        shortHashKey = hashKey.substring(0, 6);
        // console.log(shortHashKey);
        return shortHashKey;
    }
}