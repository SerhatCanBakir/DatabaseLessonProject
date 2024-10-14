const exp =  require('express');
const app = exp();
const path = require('path');
const dotnev = require("dotenv");
const bodyParser = require('body-parser');
const {pageRouter} = require('./routers/mainRouter.js')
const {apiRouter} = require('./routers/apiRouter.js');
dotnev.config();
const Port =  3000 || process.env.PORT;


app.set("view engine","ejs");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
app.use(exp.static("public"));
app.use('/',pageRouter);
app.use('/api',apiRouter);
app.listen(Port,()=>{
    console.log(`app ${Port} adresinde dinleniyor`);
})