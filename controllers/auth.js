const bcrypt = require('bcryptjs');
const async = require('hbs/lib/async');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { promisify } = require('util');
require('dotenv').config();

const jwt_pass = 'cookiepass';

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

exports.register = (req, res) => {

    const{username, email, pass, passrepeat} = req.body;

    database.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error){
            console.log(error);
        }

        if(pass !== passrepeat){
            return res.render('register', {
                messageError: 'Passwords are not same'
            });
        }
        else if(result.length > 0){
            return res.render('register', {
                messageError: 'Email addres is already in use'
            });
        }
        
        let hashedPassword = await bcrypt.hash(pass, 8);

        console.log(hashedPassword);
        
        database.query('INSERT INTO users SET ?', {username: username, email: email, password: hashedPassword, usertype: 'customer'}, (error, result) => {
            if(error){
                console.log(error);
            }
            else{
                return res.render('register', {
                    messageSuccess: 'Successfull register'
                });     
            }
        });
    });
}

exports.login = (req, res) => {

    const email = req.body.email;
	const password = req.body.pass;

    if( !email || !password ){
        return res.render('login', {
            message: 'Incomplete information entered!'

        });
    }

    database.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
        if(error){
            console.log(error);
        }

        var json =  JSON.parse( JSON.stringify(result) );

        if(result.length > 0 && bcrypt.compareSync(password, json[0].password)){
            const id = json[0].username;

            const token = jwt.sign({id: id}, jwt_pass, {
                expiresIn: '1d'
            });

            const cookieOptions = {
                expires: new Date(
                    Date.now() + 864000
                ),
                httpOnly: true
            }

            const role = json[0].usertype;

            if(role == 'customer'){
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/customerProfile');
            }
            else if(role == 'worker'){
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/workerProfile');
            }
            else if(role == 'manager'){
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/managerProfile');
            }

        }
        else{
            return res.render('login', {
                message: 'Wrong password or username'

            });
        }        
        
    });
}

exports.isLoggedIn = async (req, res, next) => {
    if( req.cookies.jwt){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, jwt_pass);
  
            database.query('SELECT * FROM users WHERE username = ?', [decoded.id], (error, result) => {
                if(!result) {
                return next();
                }

                req.user = result[0];
                req.usertype = result[0].usertype;
                req.username = result[0].username;
                return next();
    
            });
        }catch(error){
            console.log(error);
            return next();
        }
    }else{
        next();
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('jwt');

    res.redirect('/');
}