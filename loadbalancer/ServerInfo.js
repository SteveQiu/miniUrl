module.exports = class ServerInfo {
    constructor(name) {
        this.name=name
        this.date = new Date()
    }

    isInactive(now){
        return (now.getTime()-this.date.getTime() ) < 4000
    }
    isSameHost(name){
        return this.name==name
    }
    refresh(){
        this.date = new Date()
    }
}