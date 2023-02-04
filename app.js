const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const { mainModule } = require('process');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');

const app = express();
hbs.registerPartials(__dirname + '/partials');
const publicDirectory = path.join(__dirname, '/public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieparser());
app.use(fileUpload());

app.set('view engine', 'hbs');

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/manager', require('./routes/manager'));
app.use('/worker', require('./routes/worker'));
app.use('/customer', require('./routes/customer'));
app.use('/meet', require('./routes/pages'));
app.use('/cart', require('./routes/cart'));
app.use('/product', require('./routes/product'));

app.listen(5000, () => {
    console.log("Server started at port 5000");
});

