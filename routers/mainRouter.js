const {Router} = require('express');
const pageRouter = Router();
const path = require('path');
pageRouter.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'));
})
pageRouter.get('/mainpage',(req,res)=>{
    res.render(path.join(__dirname,'../views/mainpage.ejs'),{books:'hehe'})
})
pageRouter.get('/file/:file',(req,res)=>{
    res.send(path.join(__dirname,'../public/login.js'));
})
module.exports = {
    pageRouter,
}