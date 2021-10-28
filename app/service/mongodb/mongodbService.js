const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
const hashGenerator = require('./hashGenerator.js');
// main().catch(err => console.log(err));

mongoose.connect('mongodb://localhost:27017/miniUrl');

module.exports = {
    listAll(){
        return Pair.find();
    },
    save(url){
        console.log(mongoose.connection.readyState);
        console.log("Generated Hash:")
        // hashKey = null
        hashKey = hashGenerator.generateHash(url);
        (async () => {Pair.findOne({key: hashKey}).then(function(doc){
            if(doc != null){
                console.log("Hash already exists");
                console.log("doc", Object.keys(doc).length, doc);
                hashKey = hashGenerator.generateHash(url+"_"+Math.random());
            }   
                // const newPair = new Pair({key:hashKey, value:url})
                // newPair.save()
        });})();
    },
    get(key){
        return Pair.findOne({key})
    }
}