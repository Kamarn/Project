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


exports.orders = (req, res) => {

    if( (req.user) && req.usertype == 'customer' ) {
        database.query('SELECT * FROM orders WHERE userID = ?', [req.user.userID], async (error, result) => {
            if(error){
                console.log(error);
            }
    
            if(result.length > 0){
                var order = true;
            }
            
            res.render('userOrders', { orders: result, order, user: req.user});
        });
        
    } else {
        res.redirect('/login');
    }   
}