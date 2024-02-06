const express = require('express');
const {adminRegistered,adminLogin, adminUpdate, authenticate, authenticateAdmin} = require('../controller/adminController')

const Router = express.Router();

Router.post('/registered',adminRegistered);

Router.get('/login',adminLogin)

Router.put('/admins/:id',adminUpdate);

Router.get('/protected-route', authenticateAdmin, (req, res) => {
    res.send({ status: true, msg: 'You have access to the protected route', user: req.admin });
});

Router.post('/logout',authenticateAdmin, authenticate)

module.exports = Router ; 