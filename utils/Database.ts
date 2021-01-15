import mongoose from 'mongoose'

class Database {
  static connect (callback: (() => void)) {
    mongoose.connect('mongodb://localhost/blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => callback())
  }
}

export default Database
