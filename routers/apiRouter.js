const {Router} = require('express');
const apiRouter = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(require('path').resolve(__dirname,'../.env'));
const {Login} = require('../database/databaseOperations.js');
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


module.exports={
    apiRouter,
}