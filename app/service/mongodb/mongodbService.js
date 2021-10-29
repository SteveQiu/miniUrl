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
        try {
            return base64.decode(string);
        } catch (error) {
            return null
        }
    },
    encodeKeyToString(key) {
        return base64.encode(key);
    },
    get(key){
        let num = this.decodeStringToKey(key)
        if(!num) return Promise.resolve(null)
        if(end){
            return Pair.findOne({key: {
                $eq: num,
                $lt:end,
                $gt:start,
            }}).exec()
        } else {
            return Pair.findOne({key: {
                $gte:start,
                $eq: num,
            }}).exec()
        }
    },
    async updateSliceIndex(pos, total){
        if (pos==serverPos && total == serverCount) return

        serverPos=pos
        serverCount=total
        
        const counter = await Counter.findOne({key: "counter"}).exec();
        const pairCount = counter.value
        
        start = Math.floor( pairCount / serverCount * serverPos)
        if(serverPos != serverCount-1){
            end = Math.ceil(pairCount/serverCount*(serverPos+1 ))
        } else {
            end = null
        }
        console.log(`updating slice index position ${start} ~ ${end} `);
    }
}