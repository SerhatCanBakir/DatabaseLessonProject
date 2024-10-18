const {Router} = require('express');
const pageRouter = Router();
const path = require('path');
require('dotenv').config(require('path').resolve(__dirname,'../.env'));
const jwt = require('jsonwebtoken');
const {TakeAllBooks} = require('../database/databaseOperations.js');
const cookieParser = require('cookie-parser');


 pageRouter.use(cookieParser());

 const verifyTokenFromCookieToAdmin = (req, res, next) => {
    // Cookie'den token'ı al
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı' });
    }

    // Token'ı doğrulama
    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token' });
        }

        // Doğrulanmış kullanıcı bilgilerini req.user'a ekle
        if(decoded.role=='admin'){
        next();}else{
            res.status(403).json({message:'yetkisiz piç'});
        }
    });
}

const verifyTokenFromCookie = (req, res, next) => {
    // Cookie'den token'ı al
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı' });
    }

    // Token'ı doğrulama
    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token' });
        }

        // Doğrulanmış kullanıcı bilgilerini req.user'a ekle
        req.user = decoded;

        next();
    });
};

pageRouter.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'));
})
pageRouter.get('/mainpage',verifyTokenFromCookie,(req,res)=>{
    TakeAllBooks().then(resp=>{
        console.log(resp);
        res.render(path.join(__dirname,'../views/mainpage.ejs'),{books:resp})})
    
})

pageRouter.get("/adminpage",verifyTokenFromCookieToAdmin,(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/adminPage.html"
    ));
})
pageRouter.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,"../views/register.html"));
})
pageRouter.get('/file/:file',(req,res)=>{
  
    res.sendFile(path.join(__dirname,'../public/',req.params.file));
})
module.exports = {
    pageRouter,
}