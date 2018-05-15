var mongoose = require('mongoose');

var config = {
    dbURL : 'mongodb://localhost:27017/HardineroDb'
}

var UserSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
});

mongoose.connect(config.dbURL);

var User = mongoose.model('User',UserSchema);

// var user = User();
// user._id = '123';
// user.username = 'kimachesita';
// user.password = 'qwe';
// user.firstname = 'kim';
// user.lastname = 'paller';

// user.save(function(err){
//     if(err) throw err;
//     console.log('user created!');
// })

User.find(function(err,users){
    if(err) console.log(err);
    console.log(users);
})