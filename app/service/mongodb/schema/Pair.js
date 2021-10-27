const mongoose = require('mongoose');

const pairSchema = new mongoose.Schema({
    key: String,
    value: String,
});

pairSchema.methods.toString = function toString() {
    const key = this.key;
    const value = this.value
    console.log({key, value});
};
const Pair = mongoose.model('Pair', pairSchema);

module.exports = Pair;