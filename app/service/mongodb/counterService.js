const Counter = require('./schema/Counter');

(async() => {Counter.findOne({key: "counter"}).then(function(doc){
    if(doc == null){
        var counterInit = new Counter({key: "counter", value: Number(0)});
        counterInit.save();
    }
});
})();

module.exports = {
    async updateCounter(counter){
        try {
            await Counter.updateOne({key: "counter"}, { $set: { value: Number(++counter) } })
        } catch (error) {
            console.log("Error while updating counter:", error);
        }
    }
}