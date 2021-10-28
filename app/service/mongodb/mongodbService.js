var base64 = require('base-64');
const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
const Counter = require('./schema/Counter');
const counterService = require('./counterService.js');
let serverPos = 0, serverCount=0, start=0, end;


mongoose.connect('mongodb://localhost:27017/miniUrl');

module.exports = {
    listAll(){
        return Pair.find();
    },
    async save(url){
        console.log("Starting save process:");
        try {
            let counter = await Counter.findOne({key: "counter"}).exec();
            const newPair = new Pair({key: counter.value, value:url})
            newPair.save()
            counterService.updateCounter(counter.value)
            return this.encodeKeyToString(counter.value)
        } catch (error) {
            console.log("Error while saving with counter:", error);
        }
        return null
    },
    decodeStringToKey(string) {
        return base64.decode(string);
    },
    encodeKeyToString(key) {
        return base64.encode(key);
    },
    get(key){
        let query = Pair.findOne({key: this.decodeStringToKey(key)}).where('key').gt(start)
        if(end){
            return query.lt(end)
        } else {
            return query
        }
    },
    async updateSliceIndex(pos, total){
        console.log(pos,total);
        if (!(pos==serverPos && total == serverCount)) return

        serverPos=pos
        serverCount=total

        const counter = await Counter.findOne({key: "counter"}).exec();
        const pairCount = counter.value

        start = Math.floor( pairCount / serverCount * serverPos)
        if(serverPos != serverCount){
            end = Math.ceil(pairCount/serverCount*(serverPos+1 ))
        } else {
            end = null
        }
    }
}