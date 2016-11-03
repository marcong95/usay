let user = {
  _id: ObjectID,
  username: String,
  password: String,
  salt: String,
  nickname: String,
  avatar: {
    url: String
  },
  bio: String,
  created: Date,
  lastOnline: Date,
  favourites: [{
    to: ObjectID,
    created: Date
  }],
  upvoteds: [{
    to: ObjectID,
    created: Date
  }]
}

let post = {
  _id: ObjectID,
  poster: ObjectID,
  created: Date,
  content: String,
  upvoters: [{
    from: ObjectID,
    created: Date
  }],
  images: [{
    order: Number,
    url: String
  }],
  comments: [{
    from: ObjectID,
    to: ObjectID,
    content: String,
    created: Date
  }]
}