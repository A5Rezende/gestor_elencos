const Jogador = require('../models/Jogador');

exports.inicio = function(req, res) {
    res.render('jogador', {jogador: {}});
}

exports.adicionar = async function(req, res) {
    try {
        //console.log(req.body);
        const jogador = new Jogador(req.body);
        await jogador.adicionar();

        if(jogador.erros.length > 0) {
            req.flash('errors', jogador.erros);
            req.session.save(() => res.redirect('/jogador'));
            return;
        }

        req.flash('success', 'Seu jogador foi criado');
        req.session.save(() => res.redirect(`/jogador/index/${jogador.jogador._id}`));
        return;
    }
    catch(e) {
        console.log(e);
        res.render('404');
    }
}

exports.editaIndex = async function(req, res) {
    if (!req.params.id) return res.render('404');
    
    const jogador = await Jogador.buscarPorId(req.params.id);

    if(!jogador) return res.render('404');

    jogador.posicao = jogador.posicao.split(", ");
    jogador.tipo = jogador.tipo.split(", ");

    res.render('jogador', {jogador});
}

exports.editar = async function(req, res) {
    try {
        if(!req.params.id) return res.render('404');
        const jogador = new Jogador(req.body);
        await jogador.editar(req.params.id);

        if(jogador.erros.length > 0) {
            req.flash('errors', jogador.erros);
            req.session.save(() => res.redirect(`/jogador/index/${req.params.id}`));
            return;
        }

        req.flash('success', 'Jogador atualizado');
        req.session.save(() => res.redirect(`/jogador/index/${req.params.id}`));
        return;
    }
    catch(e) {
        console.log(e);
        res.render('404');
    }
}

exports.remover = async function(req, res) {
    if(!req.params.id) return res.render('404');
    
    const jogador = await Jogador.remover(req.params.id);
    if(!jogador) return res.render('404');

    req.flash('success', 'Jogador apagado.');
    req.session.save(() => res.redirect('../'));
    return;
}