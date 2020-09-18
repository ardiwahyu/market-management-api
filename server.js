const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config()

const productRoute = require('./src/routes/productRoute');
const buyRoute = require('./src/routes/buyRoute');
const saleRoute = require('./src/routes/saleRoute');
const configRoute = require('./src/routes/configRoute');
const rekapRoute = require('./src/routes/rekapRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

//routes
app.use('/api/v1', productRoute);
app.use('/api/v1', buyRoute);
app.use('/api/v1', saleRoute);
app.use('/api/v1', configRoute);
app.use('/api/v1', rekapRoute);

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