const mongoose = require('mongoose');

const pairSchema = new mongoose.Schema({
    key: String,
    value: String,
}, { shardKey: { key: 8 }} );

pairSchema.methods.toString = function toString() {
    const key = this.key;
    const value = this.value
    return JSON.stringify({key, value});
};

pairSchema.methods.getObjects = function getObjects() {
    const key = this.key;
    const value = this.value
    return {key, value};
};

const Pair = mongoose.model('Pair', pairSchema);

module.exports = Pair;