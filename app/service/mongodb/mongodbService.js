const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
// main().catch(err => console.log(err));

mongoose.connect('mongodb://localhost:27017/miniUrl');

module.exports = {
    listAll(){
        console.log(mongoose.connection.readyState);
        return Pair.find();
    },
    save(url){
        console.log(mongoose.connection.readyState);
        const newPair = new Pair({key:Math.random(), value:url})
        newPair.save()
    },
    get(key){

    }
}