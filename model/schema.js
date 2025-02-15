const mongoose = require('mongoose')

const Records = new mongoose.Schema({
    dn:String,
    hn:String,
    diag:String,
    file:String,
},{collection:"records"})

module.exports = mongoose.model("records",Records)