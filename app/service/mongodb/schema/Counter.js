const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    key: String,
    value: String,
},);

// pairSchema.methods.toString = function toString() {
//     const key = this.key;
//     const value = this.value
//     return JSON.stringify({key, value});
// };

counterSchema.methods.getObjects = function getObjects() {
    const key = this.key;
    const value = this.value
    return {key, value};
};

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;