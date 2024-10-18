

const mysql2 = require('mysql2');

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
    const qry2 = "SELECT * FROM authors"
    return new Promise((resolve, rejects) => {
        connection.query(qry, (err, resuts) => {
            if (err) {
                console.log(err);
                rejects(err)
            } else {

                connection.query(qry2, (err, resuts2) => {
                    resuts.forEach(Element2 => {
                        Element2.author_id = resuts2[Element2.author_id - 1].name;
                    })
                    resolve(resuts);
                })
            }
        })
    })
}

const SellBook = (userid, id, piece) => {
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

                CreateSales(userid, id, piece).then(resp => {
                    const TSO = { sales: resp, selled: ress.affectedRows }
                    resolve(TSO);
                }).catch();


            })


        })
    })
}
const AddToCart = (userId, BookId, piece) => {
    const qry1 = "INSERT INTO cart_items(cart_id,book_id,quantity)";
    return new Promise((resolve, rejects) => {
        connection.query(qry1, [userId, BookId, piece], (err, data) => {
            if (err) {
                console.log(err);
                rejects(err);

            }
            resolve(data.affectedRows);
        })
    })
}

const CreateSales = (userId, BookdID, piece) => {
    const qry1 = "INSERT INTO sales(user_id,book_id,quantity,price) VALUES(?,?,?,?)";
    const qry2 = "SELECT * FROM books WHERE id=?";
    return new Promise((resolve, rejects) => {
        connection.query(qry2, BookdID, (err, rest) => {
            if (err) {
                console.log(err);
                rejects(err);
            }
            console.log(rest);
            const salesPrice = rest[0].price * piece;
            connection.query(qry1, [userId, BookdID, piece, salesPrice], (err, resp) => {
                if (err) {
                    console.log(err);
                    rejects(err);
                }
                resolve(resp.affectedRows);
            })
        })
    })
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

const AddNewBook = (title, author, genre, description, stock, price) => {
    const qry1 = "SELECT * from author Where name=?";
    const qry2 = "INSERT INTO books(title,author_id,genre,description,stock,price) VALUES(?,?,?,?,?,?)";
    return new Promise((resolve, rejects) => {
        connection.query(qry1, author, (err, data) => {
            if (err) {
                rejects(err);
                console.log(err);
            }
            let authorid = data[0].id;
            connection.query(qry2, [title, authorid, genre, description, stock, price], (err, data2) => {
                if (err) {
                    console.log(err);
                    rejects(err)
                }
                resolve(data2);
            })
        })
    })
}

const CreateNewAuth = (author) => {
    const qry = "INSERT INTO authors (name) VALUES(?)"
    return new Promise((resolve, rejects) => {
        connection.query(qry, author, (err, datas) => {
            if (err) {
                rejects(err);
            }
            resolve(datas);
        })
    })

}

const Register = (username, pass) => {
    const qry1 = "SELECT * FROM users WHERE username=?";
    const qry2 = "INSERT INTO users (username,password,role) VALUES(?,?,'user')"

    return new Promise((resolve, rejects) => {
        connection.query(qry1, username, (err, data) => {
            if (err) {
                console.log(err);
                rejects(err)
                return;
            }

            if (data.length == 0) {
                connection.query(qry2, [username, pass], (err, data) => {
                    if (err) {
                        console.log(err);
                        rejects(err);
                        return;
                    }
                    CreateNewCart(data[0].id).then(resp => {
                        console.log(resp);
                        resolve(data.affectedRows[0]);
                    });

                })
            }

        })
    })

}

const CreateNewCart = (userid) => {
    const qry1 = "INSERT INTO CARTS(user_id)";
    return new Promise((resolve, rejects) => {
        connection.query(qry1, userid, (err, datas) => {
            if (err) {
                console.log(err);
                rejects(err);
            }
            resolve(datas.affectedRows);
        })
    })
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