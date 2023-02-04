const mysql = require('mysql');
require('dotenv').config();

var database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

database.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to database");
    }
});

exports.display = (req, res) => {

    if( (req.user) && req.usertype == 'worker' ) {

        database.query('SELECT * FROM users', async (error, result) => {
            if(error){
                console.log(error);
            }
    
            if(result.length > 0){
                var ans = true;
            }
            var json =  JSON.parse( JSON.stringify(result) );
            var yonetim = [];
            var customer = [];
    
            for (let i = 0; i < json.length; i++) {
                if(json[i].usertype == 'manager' || json[i].usertype == 'worker'){
                    yonetim.push(json[i]);
                }
                else if(json[i].usertype == 'customer'){
                    customer.push(json[i]);
                }
                
            }
    
            res.render('workerProfile', { yonetim, customer, ans, user: req.user });
        });

    } else {
        res.redirect('/login');
    }

    
}

exports.displaySelected = (req, res) => {

    if( (req.user) && req.usertype == 'worker' ) {

        const email = req.params.email;

    database.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
        if(error){
            console.log(error);
        }
        res.render('updateData', { result, user: req.user });
    });

    } else {
        res.redirect('/login');
    }
    
}

exports.update = (req, res) => {

    if( (req.user) && req.usertype == 'worker' ) {

        const email = req.body.email;
    const username = req.body.username;

    database.query('UPDATE users SET username = ? WHERE email = ?', [username, email], async (error, result) => {
        if(error){
            console.log(error);
        }
    });
    
    database.query('SELECT * FROM users', async (error, result) => {
        if(error){
            console.log(error);
        }

        if(result.length > 0){
            var ans = true;
        }
        var json =  JSON.parse( JSON.stringify(result) );
        var yonetim = [];
        var customer = [];

        for (let i = 0; i < json.length; i++) {
            if(json[i].usertype == 'manager' || json[i].usertype == 'worker'){
                yonetim.push(json[i]);
            }
            else if(json[i].usertype == 'customer'){
                customer.push(json[i]);
            }
        }
        res.render('workerProfile', { yonetim, customer, ans, user: req.user });
    });

    } else {
        res.redirect('/login');
    }

    
}