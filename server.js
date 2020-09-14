const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()

const productRoute = require('./src/routes/productRoute');
const buyRoute = require('./src/routes/buyRoute');
const saleRoute = require('./src/routes/saleRoute');

app.use(express.json());
app.use(express.urlencoded());

//routes
app.use('/api/v1', productRoute);
app.use('/api/v1', buyRoute);
app.use('/api/v1', saleRoute);

// Unmatched routes handler
app.use((req, res) => {
    if (req.method.toLowerCase() === 'options') {
        res.end();
    } else {
        res.status(404).type('txt').send('Not Found');
    }
})

let listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`App runing on PORT ${listener.address().port}`)
})