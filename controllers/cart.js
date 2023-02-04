const authController = require('../controllers/auth');
const productController = require('../controllers/product');
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

exports.mycart= (req, res) => {

    const userID = req.user.userID;
    var totalPrice = 0;
    database.query('SELECT productName, productPrice, productImage, quantity, cart.productID FROM cart JOIN Product ON Product.productID = Cart.productID WHERE userID = ?', [userID], async (error, result) => {
        if(error){
            console.log(error);
        }

        if(result.length > 0){
            var ans = true;
        }

        var json =  JSON.parse( JSON.stringify(result) );

        for (let i = 0; i < json.length; i++) {
            totalPrice = totalPrice + json[i].productPrice * json[i].quantity;
        }
        
        res.render('cart', { result, ans, totalPrice, user: req.user});
    });
}

exports.add = (req, res) => {

    if( req.user ) {
        const userID = req.user.userID;
        const productID= req.params.productID;
        var quantity = 1;

        database.query('SELECT * FROM cart WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
            if(error){
                console.log(error);
            }
            if(result.length > 0){
                database.query('UPDATE cart SET quantity = quantity + 1 WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
                    if(error){
                        console.log(error);
                    }
                });
                res.redirect('/');
            }
            else{
                database.query('INSERT INTO cart SET ?', {userID: userID, productID: productID, quantity: quantity}, async (error, result) => {
                    if(error){
                        console.log(error);
                    }
                });
                
                res.redirect('/');
            }
        });

    } else {
        res.redirect('/login');
    }
        
}

exports.remove = (req, res) => {

    const userID = req.user.userID;
    const productID= req.params.productID;

    database.query('DELETE FROM cart WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
        if(error){
            console.log(error);
        }
    });

    res.redirect('/cart/mycart');
}

exports.removeOnlyOne = (req, res) => {

    const userID = req.user.userID;
    const productID= req.params.productID;

    database.query('UPDATE cart SET quantity = quantity - 1 WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
        if(error){
            database.query('DELETE FROM cart WHERE userID = ? AND productID = ?', [userID, productID], async (error, result) => {
                if(error){
                    console.log(error);
                }
            });
        }
    });

    res.redirect('/cart/mycart');
}