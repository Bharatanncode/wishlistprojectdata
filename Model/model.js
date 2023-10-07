const mongoose = require('mongoose');
const anncode = mongoose.Schema({
    MyShopifyDomain: String,
    accessToken: String,
    ProductObject:{type:Array}

})
module.exports = mongoose.model('anncodes', anncode);
