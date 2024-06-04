const Usuario = require('../models/Usuario');

exports.inicio = function(req, res) {
    res.render('login');
    return;
}

exports.cadastro = async function(req, res) {
    
    try {

        const usuario = new Usuario(req.body);
        await usuario.cadastro();


        if(usuario.errors.length > 0) {
            req.flash('errors', usuario.errors);
            req.session.save(function() {
                return res.redirect('/login');
            });
            return;
        }

        req.flash('success', 'Seu usuario foi criado');
        req.session.save(function() {
            return res.redirect('/login');
        });
    } 
    catch(e) {
        console.log(e);
        res.render('404');
    }
};

exports.login = async function(req, res) {

    try {
        const usuario = new Usuario(req.body);
        await usuario.login();

        if (usuario.errors.length > 0) {
            req.flash('errors', usuario.errors);
            req.session.save(function() {
                return res.redirect('/login');
            })
            return;
        }

        req.flash('success', 'Logado');
        req.session.user = usuario.user;
        req.session.save(function() {
            return res.redirect('/');
        });
    }
    catch(e) {
        console.log(e);
        res.render('404');
    }
};

exports.logout = async function(req, res) {
    req.session.destroy();
    res.redirect('/');
}