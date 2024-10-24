const { Router } = require('express');
const apiRouter = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(require('path').resolve(__dirname, '../.env'));
const { Login, Register, AddNewBook, CreateNewAuth, AddExistedBook, updateBookStock, TakeAllBooks, TakeAllAuthors, deleteBook } = require('../database/databaseOperations.js');



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
        if (decoded.role == 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'yetkisiz piç' });
        }
    });
}


apiRouter.post('/login', (req, res) => {
    console.log(req.body);

    Login(req.body.username, req.body.password).then(
        resp => {
            console.log(resp);
            if (resp) {
                const token = jwt.sign(resp[0], process.env.TOKEN, { expiresIn: 60 * 60 })
                const returnObject = { token: token, role: resp[0].role }
                res.status(200);
                res.send(returnObject);
            } else {
                res.sendStatus(403);
            }
        }
    )
})

apiRouter.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    Register(username, password).then(resp => {
        console.log(resp);
        if (resp) {
            const token = jwt.sign(resp, process.env.TOKEN, { expiresIn: 60 * 60 });
            const returnObject = { token: token, role: resp.role }
            res.status(200);
            res.send(returnObject);
        } else {
            res.sendStatus(403);
        }
    });
})


apiRouter.post('/addnewbook', verifyTokenFromCookieToAdmin, (req, res) => {
    if (req.body.title && req.body.author && req.body.genre && req.body.description && req.body.stock && req.body.price) {
        AddNewBook(req.body.title, req.body.author, req.body.genre, req.body.description, req.body.stock, req.body.price).then(
            resp => {
                res.status(200).json(resp[0]);
            }
        ).catch(err => {
            res.status(500).send(err);
        })
    } else {
        res.sendStatus(400);
    }
})

apiRouter.post('/addauthor', verifyTokenFromCookieToAdmin, (req, res) => {
    console.log(req.body);
    if (req.body.authorName) {
        CreateNewAuth(req.body.authorName).then(resp => {
            res.status(200).json(resp[0]);
        }).catch(err => {
            res.status(500).send(err);
        });
    } else {
        res.sendStatus(400);
    }
})


apiRouter.post('/changestock', verifyTokenFromCookieToAdmin, (req, res) => {
    console.log(req.body);
    let title = req.body.title;
    let piece = req.body.piece;
    if (title && piece) {
        if (req.body.type == 'add') {
            AddExistedBook(title, piece).then(resp => {
                res.sendStatus(200).json(resp[0]);
            }).catch(err => {
                res.status(500).send(err);
            });
        } else if (req.body.type == 'update') {
            updateBookStock(title, piece).then(resp => {
                res.status(200).json(resp);
            }).catch(err => {
                res.status(500).send(err);
            })
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
})

apiRouter.get('/getallbooks', (req, res) => {
    TakeAllBooks().then(resp => {
        // console.log(resp)
        if (Array.isArray(resp)) {
            console.log('array kontrolu calisiyo');
            let titles = [];
            for (let i = 0; i < resp.length; i++) {

                //    console.log(resp[i]);
                if (resp != undefined) {
                    titles.push(resp[i].title);
                }
            }
            res.json({ titles: titles });
        } else {
            res.sendStatus(500);
        }
    }).catch(err => {
        console.log(err)
        res.sendStatus(500);
    })
})

apiRouter.get('/getallauthers', (req, res) => {
    TakeAllAuthors().then(resp => {
        let authorsname = [];
        if (Array.isArray(resp)) {
            for (let i = 0; i < resp.length; i++) {
                authorsname.push(resp[i].name);
            }
            res.send({ author: authorsname });
        } else {
            res.sendStatus(500);
        }
    })
})

apiRouter.delete('/deletebook', verifyTokenFromCookieToAdmin, (req, res) => {
    let title = req.body.title;
    if (title) {
        deleteBook(title).then(resp => { res.sendStatus(200) }).catch(err => res.status(500));
    }
})

module.exports = {
    apiRouter,
}