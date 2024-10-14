const { rejects } = require('assert');
const mysql2 = require('mysql2');
const { resolve } = require('path');
const { Connection } = require('pg');
require('dotenv').config(require('path').resolve(__dirname,'../.env'));

    var connection =  mysql2.createConnection({
        host:process.env.HOST,
        user:process.env.USER,
        password:process.env.PASSWORD,
        database:process.env.DATABASE
    })

connection.connect(err=>{
    if(err){
    console.log(err);
return}
  console.log('DATABASE CONNECTİON SUCCESSFUL');
})
const Login = (username,password)=>{
    const qry = "SELECT * FROM users HAVING username= ?";
    return new Promise((resolve,rejects)=>{
    connection.query(qry,username,(err,resuts)=>{
        if(err){
            console.log(err)
            rejects(err)
        }
        else{
            if(password==resuts.password){ resolve(resuts)}else{
                resolve(false);
            }
        }
    })})

}

const TakeAllBooks = ()=>{
    const qry = "SELECT * FROM books";
    return new Promise((resolve,rejects)=>{
        connection.query(qry,(err,resuts)=>{
            if(err){
                console.log(err);
                rejects(err)
            }else{
                resolve(resuts);
            }
        })
    })
}

const SellBook = (id,piece)=>{
    const qry1 = "SELECT * FROM books WHERE id = ?";
    const qry2 = "UPDATE books Set stock = ? WHERE id = ?";
    return new Promise((resolve,rejects)=>{
        connection.query(qry1,(err,result)=>{
            if(err){
                console.log(err);
                rejects(err);
            }
            
            piece = result.stock-piece;
            connection.query(qry2,[piece,id],(err,ress)=>{
                if(err){
                    console.log(err);
                    rejects(err);
                }

                resolve(ress.affectedRows);
            })
            

        })
    })
}

module.exports={
    Login,

}