var base64 = require('base-64');
const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
const Counter = require('./schema/Counter');
const counterService = require('./counterService.js');


mongoose.connect('mongodb://localhost:27017/miniUrl');

module.exports = {
    listAll(){
        return Pair.find();
    },
    async save(url){
        console.log(mongoose.connection.readyState);
        console.log("Starting save process:");
        try {
            let counter = await Counter.findOne({key: "counter"}).exec();
            const newPair = new Pair({key: counter.value, value:url})
            newPair.save()
            counterService.updateCounter(counter.value)
        } catch (error) {
            console.log("Error while saving with counter:", error);
        }
    },
    decodeStringToKey(string) {
        return base64.decode(string);
    },
    encodeKeyToString(key) {
        return base64.encode(key);
    },
    get(key){
        return Pair.findOne({key})
    },
    updateSliceIndex(pos, total){
        console.log(pos,total);
        if (pos!==serverPos || total !== serverCount) {
            console.log('recalculate index');
            serverPos=pos
            serverCount=total
        }
    }
}