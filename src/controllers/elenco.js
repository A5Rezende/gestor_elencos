const Jogador = require('../models/Jogador');

exports.inicio = async function(req, res) {

    const path = req.path;
    const parts = path.split('/');
    const filteredParts = parts.filter(part => part.length > 0);
    const lastPart = filteredParts[filteredParts.length - 1];
    
    const jogadores = await Jogador.buscaJogadores(lastPart, req.session.user._id);
    res.render('elenco', {lastPart, jogadores});
    return;
}
