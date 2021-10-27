const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
// main().catch(err => console.log(err));

mongoose.connect('mongodb://localhost:27017/miniUrl');

module.exports = {
    listAll(){
        return Pair.find();
    },
    save(url){
        const newPair = new Pair({key:Math.random(), value:url})
        newPair.save()
    },
    get(key){
        return Pair.findOne({key})
    }
}