const mongoose = require('mongoose');
const Pair = require('./schema/Pair');
// main().catch(err => console.log(err));
var serverPos=0, serverCount=0

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