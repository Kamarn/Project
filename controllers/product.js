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

exports.display = async (req, res, next) => {
    database.query('SELECT * FROM Product', async (error, result) => {
        if(error){
            console.log(error);
        }

        res.render('index', { products: result, user: req.user });
    });
}

exports.productinfo = async (req, res, next) => {
    const productName= req.params.productName;

    database.query('SELECT * FROM Product WHERE productName = ?', [productName], async (error, result) => {
        if(error){
            console.log(error);
        }

        res.render('productinfo', { product: result, user: req.user });
    });
}

exports.displayforadmin = async (req, res, next) => {

    if( (req.user) && req.usertype == 'manager' ) {
        database.query('SELECT * FROM Product', async (error, result) => {
            if(error){
                console.log(error);
            }
    
            if(result.length > 0 ){
                var displayforadmin = true;
            }
    
            res.render('product', { products: result, user: req.user, crud: displayforadmin });
        });
    } else {
        res.redirect('/login');
    }    
}

exports.delete = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {

        const productID = req.params.productID;
        database.query('DELETE FROM product WHERE productID = ?', [productID], async (error, result) => {
            if(error){
                console.log(error);
            }
        });
        res.redirect('/product/crud');

    } else {
        res.redirect('/login');
    }

}

exports.displaySelected = (req, res) => {
    
    const productID = req.params.productID;

    database.query('SELECT * FROM product WHERE productID = ?', [productID], async (error, result) => {
        if(error){
            console.log(error);
        }
        res.render('updateProduct', { result });
    });
}

exports.update = (req, res) => {
    

    if( (req.user) && req.usertype == 'manager' ) {

        const{productName, productPrice, productQuantity, productID} = req.body;

        database.query("UPDATE product SET productName = ?, productPrice = ?, productQuantity = ? WHERE productID = ?", [productName, productPrice, productQuantity, productID], async (error, result) => {
            if(error){
                console.log(error);
            }
        });
        res.redirect('/product/crud');

    } else {
        res.redirect('/login');
    }

}

exports.buy = async (req, res, next) => {

    const userID = req.user.userID;

    database.query('INSERT INTO Orders SELECT Cart.userID, Product.productID, Product.productName, Product.productPrice, Cart.quantity FROM Cart JOIN Product ON Product.productID = Cart.productID WHERE Cart.userID = ?', [userID], async (error, result) => {
        if(error){
            console.log(error);
            var messageError = "An error occured"
        }

        database.query("UPDATE Product JOIN Cart ON Product.productID = Cart.productID SET productQuantity = productQuantity - Cart.quantity WHERE Cart.userID = ?", [userID], async (error, result) => {
            if(error){
                console.log(error);
            }
        });

        database.query('DELETE FROM cart WHERE userID = ?', [userID], async (error, result) => {
            if(error){
                console.log(error);
            }
        });

        var messageSuccess = "Successfull purchase"
        res.render('cart', { product: result, user: req.user, messageError, messageSuccess });
    });
}