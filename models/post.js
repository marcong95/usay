let config = require('../configs/global.js')
let mongoose = require('mongoose')
let debug = require('debug')('database')

let postSchema = monogoose.Schema({
  poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created: Date,
  content: String,
  upvoters: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created: Date
  }],
  images: [{
    order: Number,
    url: String
  }],
  comments: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    created: Date
  }]
})

module.exports = mongoose.model('Post', postSchema)
