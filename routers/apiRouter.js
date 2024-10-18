const {Router} = require('express');
const apiRouter = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(require('path').resolve(__dirname,'../.env'));
const {Login,Register} = require('../database/databaseOperations.js');

const verifyAdmin = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    
    // Bearer kelimesinden sonra gelen token kısmını ayır
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token,process.env.TOKEN,(err,decoded)=>{
        if(err){
            res.status(403).send(err);
        }
        console.log(decoded);
        if(decoded  .role=="admin"){
            next();
        }else{
            res.status(403).send("yat assagı");
        }
    })
    
}


apiRouter.post('/login',(req,res)=>{
    console.log(req.body);
    
    Login(req.body.username,req.body.password).then(
        resp=>{
            console.log(resp);
            if(resp){
            const token = jwt.sign(resp[0],process.env.TOKEN,{expiresIn:60*60})
             const returnObject = {token:token,role:resp[0].role}
             res.status(200);
             res.send(returnObject);}else{
                res.sendStatus(403);
             }
        }
    )
})

apiRouter.post('/register',(req,res)=>{
const username = req.body.username;
const password = req.body.password;
Register(username,password).then(resp =>{
console.log(resp);
if(resp){
    const token = jwt.sign(resp,process.env.TOKEN,{expiresIn:60*60});
    const returnObject = {token:token,role:resp.role}
    res.status(200);
    res.send(returnObject);
}else{
    res.sendStatus(403);
}
});
})

module.exports={
    apiRouter,
}