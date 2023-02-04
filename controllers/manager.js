const mysql = require('mysql');
const reader = require('xlsx');
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

    if( (req.user) && req.usertype == 'manager' ) {

        database.query('SELECT * FROM users', async (error, result) => {
            if(error){
                console.log(error);
            }
    
            if(result.length > 0){
                var ans = true;
            }
            var json =  JSON.parse( JSON.stringify(result) );
            var manager = [];
            var worker = [];
            var customer = [];
    
            for (let i = 0; i < json.length; i++) {
                if(json[i].usertype == 'manager'){
                    manager.push(json[i]);
                }
                else if(json[i].usertype == 'worker'){
                    worker.push(json[i]);
                }
                else if(json[i].usertype == 'customer'){
                    customer.push(json[i]);
                }
                
            }
    
            res.render('managerProfile', { manager, worker, customer, ans , user: req.user});
        });

    } else {
        res.redirect('/login');
    }

    
}

exports.update = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {

        const email = req.params.email;
    const newType = "worker";

    database.query('UPDATE users SET usertype = ? WHERE email = ?', [newType, email], async (error, result) => {
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
        var manager = [];
        var worker = [];
        var customer = [];

        for (let i = 0; i < json.length; i++) {
            if(json[i].usertype == 'manager'){
                manager.push(json[i]);
            }
            else if(json[i].usertype == 'worker'){
                worker.push(json[i]);
            }
            else if(json[i].usertype == 'customer'){
                customer.push(json[i]);
            }
            
        }

        res.render('managerProfile', { manager, worker, customer, ans, user: req.user });
    });

    } else {
        res.redirect('/login');
    }

}

exports.delete = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {

        const email = req.params.email;

    database.query('DELETE FROM users WHERE email = ?', [email], async (error, result) => {
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
        var manager = [];
        var worker = [];
        var customer = [];

        for (let i = 0; i < json.length; i++) {
            if(json[i].usertype == 'manager'){
                manager.push(json[i]);
            }
            else if(json[i].usertype == 'worker'){
                worker.push(json[i]);
            }
            else if(json[i].usertype == 'customer'){
                customer.push(json[i]);
            }
            
        }

        res.render('managerProfile', { manager, worker, customer, ans, user: req.user });
    });

    } else {
        res.redirect('/login');
    }
}

exports.addnewproduct = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {

        const{productName, productCategory, productPrice, productQuantity, productImage} = req.body;
    
        database.query("INSERT INTO Product (productName, productPrice, productQuantity, productImage) VALUES ('"+productName+"', '"+productPrice+"', '"+productQuantity+"', '"+productImage+"')", (error, result) => {
            if(error){
                console.log(error);
            }
            else{
                return res.render('product', {
                    messageSuccess: 'Product added',
                    user: req.user
                });     
            }
        });

    } else {
        res.redirect('/login');
    }

}

exports.addnewproductexcel = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {
         
        const file = reader.readFile('./public/' + req.files.sampleFile.name)
  
        let data = []
        
        const sheets = file.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
            data.push(res)
        })
        }
       
        for(let i = 0; i < data.length; i++){
            database.query("INSERT INTO Product (productName, productPrice, productQuantity, productImage) VALUES ('"+data[i].productName+"', '"+data[i].productPrice+"', '"+data[i].productQuantity+"', '"+data[i].productImage+"')", (error, result) => {
                if(error){
                    console.log(error);
                }
            });
        }
        res.render('product', {
            messageSuccess: 'Products added',
            user: req.user
        }); 

    } else {
        res.redirect('/login');
    }

}

exports.orders = (req, res) => {

    if( (req.user) && req.usertype == 'manager' ) {

        database.query('SELECT * FROM orders', async (error, result) => {
            if(error){
                console.log(error);
            }
    
            if(result.length > 0){
                var order = true;
            }
            
            res.render('product', { orders: result, order, user: req.user});
        });
        
    } else {
        res.redirect('/login');
    }   
}