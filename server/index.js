const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var proxy = require('http-proxy-middleware');


app.use(cors());
app.use(bodyparser.json());
app.use(flash());
app.use(express.static("public"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iemandchillen',
    multipleStatements: true
});

connection.connect(err => {
    if(err){
        return err;
    }
});


app.listen(4000, () => {
    console.log("Server listening on port 4000")
});

passport.use(new LocalStrategy( 
    function(username, password, done) {
        const findUser = "SELECT userid, username, hash FROM `users` WHERE username = '" + username + "'";
        connection.query(findUser, (err, results) => {
            if(err){
                return done(err);
            } else {
                if (results.length === 0) {
                    return done(null, false, { message: "Username doesn't belong to an account." });
                }
                else if (!bcrypt.compareSync(password, results[0].hash)) {
                    return done(null, false, { message: "False password." });
                }
                return done(null, results[0]);
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
  
app.post('/api/chillen', (req, res) => {
    for(var i = 0; i < req.body.users.length; i++){
        var words = req.body.users[i].split(' ');
        var user = words[0];
        var date = words[1];
        const searchUser = "SELECT `personname`, `date` from chillen WHERE personname = '" + user + "' AND date = '" + date + "'";
        connection.query(searchUser, (err, results) => {
            if(err){
                console.log(err);
                return res.send(err);
            }else{
                if(results.length === 0){
                    const insertUser = "INSERT into `chillen` (`personname`, `date`) VALUES ('" + user + "', '" + date + "')";
                    connection.query(insertUser, (err, results) => {
                        if(err){
                            console.log(err);
                            return res.send(err);
                        }else{
                            console.log("sucessfully added user");
                        }
                    });
                } else {
                    console.log("user and date already exists");
                }
            }
        });
    }
});

app.get('/api/getChillen', (req, res) => {
    const selectAllChillen = "select DISTINCT(chillenid), `personname`, `date` from chillen inner join users on users.username = personname inner join friendswith on users.userid = friendswith.userid OR users.userid = friendswith.friendswithuserid where friendswith.userid = (SELECT userid from users where username = '" + req.user.username + "') OR friendswith.friendswithuserid = (SELECT userid from users where username = '" + req.user.username + "')";
    connection.query(selectAllChillen, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/api/getFriends', (req, res) => {
    const selectAllFriends = "SELECT DISTINCT(username) FROM users inner join friendswith on users.userid = friendswith.userid OR users.userid = friendswith.friendswithuserid where users.userid != '" + req.user.userid + "' AND (friendswith.userid = '" + req.user.userid + "' OR friendswith.friendswithuserid = '" + req.user.userid + "')"
    connection.query(selectAllFriends, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});


app.post('/api/register', (req, res) => {
    if(req.body.password.length > 0 && req.body.username.length > 0 &&  req.body.email.length > 0){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const insertUser = "INSERT INTO `users`(`username`, `hash`, `email`) VALUES ('" + req.body.username + "', '" + hash + "', '" + req.body.email + "')";
        connection.query(insertUser, (err, results) => {
            if(err){
                if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
                {
                    //i just use 401(unauthorized) for duplicate entries
                    res.status(401).send();
                } else {
                    return res.send(err);
                }
            } else {
                return res.json({
                    data: results
                })
            }
        });
    } else {
        res.status(400).send();
    }
});

app.post('/api/searchuser', (req, res) => {
    const searchUser = "SELECT userid, username FROM `users` where username like '" + req.body.search + "%' AND userid != " + req.user.userid + "";
    connection.query(searchUser, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.post('/api/sendFriendRequest', (req, res) => {
    const insertRequest = "INSERT INTO friendrequest(sentFromid, sentToid, state) VALUES ('" + req.user.userid + "', '" + req.body.toUser + "', 'PENDING')";
    connection.query(insertRequest, (err, results) => {
        if(err){
            if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062)
            {
                //i just use 401(unauthorized) for duplicate entries
                res.status(401).send();
            } else {
                return res.send(err);
            }
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.post('/api/acceptFriendRequest', (req, res) => {
    const insertRequest = "BEGIN; UPDATE friendrequest SET state = 'ACCEPTED' WHERE requestid = '" + req.body.requestid + "'; INSERT INTO friendswith(userid, friendswithuserid) VALUES ('" + req.body.userid + "', '" + req.user.userid + "'); COMMIT;";
    connection.query(insertRequest, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            console.log("accepted request");
        }
    });
});

app.post('/api/rejectFriendRequest', (req, res) => {
    const insertRequest = "UPDATE friendrequest SET state = 'REJECTED' WHERE requestid = '" + req.body.requestid + "';";
    connection.query(insertRequest, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            console.log("accepted request");
        }
    });
});

app.get('/api/getRequestCount', (req, res) => {
    const selectRequestCount = "SELECT count(requestid) as count from friendrequest where sentToid = '" + req.user.userid + "' AND state = 'PENDING'";
    connection.query(selectRequestCount, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/api/getRequests', (req, res) => {
    const selectRequests = "SELECT userid, username, friendrequest.requestid FROM users inner join friendrequest on users.userid = friendrequest.sentFromid WHERE friendrequest.sentToid = '" + req.user.userid + "' AND state = 'PENDING'";
    connection.query(selectRequests, (err, results) => {
        if(err){
            return res.send(err);
        } else {
            return res.json({
                data: results
            })
        }
    });
});

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
         return next(err); 
    }
    if (!user) {
        return res.send(info);
    }
    req.logIn(user, function(err) {
    if (err) {
        return next(err); 
    }
    return res.redirect('/app');
    });
  })(req, res, next);
});

app.get('/api/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/api/getUser', function(req, res){
    res.status(200).send({"username": req.user.username});
});

app.get('/api/authorized', function(req, res){
    if (req.user) {
        res.status(200).send({"result": true});
    } else {
        res.status(200).send({"result": false});
    }
});