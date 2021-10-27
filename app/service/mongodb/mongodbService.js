const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
// main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/miniUrl');
}

module.exports = {
    listAll(){
        // return Pair.findOne()
    },
    save(url){
        const newPair = new Pair({key:Math.random(), value:url})
        newPair.save()
    },
    get(key){

    }
}