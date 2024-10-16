const { rejects } = require('assert');
const { query } = require('express');
const mysql2 = require('mysql2');
const { resolve } = require('path');
const { Connection } = require('pg');
require('dotenv').config(require('path').resolve(__dirname, '../.env'));

var connection = mysql2.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect(err => {
    if (err) {
        console.log(err);
        return
    }
    console.log('DATABASE CONNECTİON SUCCESSFUL');
})
const Login = (username, password) => {
    const qry = "SELECT * FROM users WHERE username= ?";
    return new Promise((resolve, rejects) => {
        connection.query(qry, username, (err, resuts) => {
            if (err) {
                console.log(err)
                rejects(err)
            }
            else {
                console.log(resuts);
                console.log(password + "/" + resuts[0].password);
                if (password == resuts[0].password) { resolve(resuts) } else {
                    resolve(false);
                }
            }
        })
    })

}

const TakeAllBooks = () => {
    const qry = "SELECT * FROM books";
    return new Promise((resolve, rejects) => {
        connection.query(qry, (err, resuts) => {
            if (err) {
                console.log(err);
                rejects(err)
            } else {
                
                resolve(resuts);
            }
        })
    })
}

const SellBook = (id, piece) => {
    const qry1 = "SELECT * FROM books WHERE id = ?";
    const qry2 = "UPDATE books Set stock = ? WHERE id = ?";
    return new Promise((resolve, rejects) => {
        connection.query(qry1, (err, result) => {
            if (err) {
                console.log(err);
                rejects(err);
            }

            piece = result.stock - piece;
            connection.query(qry2, [piece, id], (err, ress) => {
                if (err) {
                    console.log(err);
                    rejects(err);
                }

                resolve(ress.affectedRows);
            })


        })
    })
}
const AddToCart = (userId, BookId, piece,) => {
    //sepete ürün ekleme yapılıcak
}

const CreateSales = (userId, BookdID, piece) => {
    // satış faturası oluşturulucak
}

const AddExistedBook = (id, piece) => {
    const qry1 = "Select * FROM books WHERE id=?"
    const qry2 = "UPDATE books Set stock =? WHERE id=?"
    return new Promise((resolve, rejects) => {
        connection.query(qry1, id, (err, data) => {
            if (err) {
                console.log(err);
                rejects(err);
            }
            piece += data.stockİ
            connection.query(qry2, [piece, id], (err, data) => {
                if (err) {
                    console.log(err)
                    rejects(err);
                }
                resolve(data.affectedRows);
            })

        })

    }

    )
}

const AddNewBook = () => {
    // sistemde olmayan yeni kitap ekle 
}

const CreateNewAuth = () => {
    // sisteme yeni yazar ekle
}

const Register = (username,pass) => {
   const qry1 = "SELECT * FROM users WHERE username=?";
   const qry2 = "INSERT INTO users (username,password,role) VALUES(?,?,'user')"
   
   return new Promise((resolve,rejects)=>{
   connection.query(qry1,username,(err,data)=>{
    if(err){
        console.log(err);
        rejects(err)
        return;
    }

    if(data.length==0){
        connection.query(qry2,[username,pass],(err,data)=>{
            if(err){
                console.log(err);
                rejects(err);
                return;
            }

            resolve(data.affectedRows[0]);
        })
    }

   })
   })
   
}

const CreateNewCart = () => {
    // yeni bir sepet yarat yeni kullanıcı için 
}

module.exports = {
    Login,
    Register,
    CreateNewAuth,
    CreateNewCart,
    AddExistedBook,
    AddNewBook,
    AddToCart,
    CreateSales,
    SellBook,
    TakeAllBooks,

}