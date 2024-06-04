const mongoose = require('mongoose');

const JogadorSchema = new mongoose.Schema({
    user: {type: String, required: true},                               // Usuario que criou
    nome: {type: String, required: true},                               // Nome 
    posicao: {type: String, required: true},                            // Posição
    idade: {type: String, required: true},                              // Idade
    altura: {type: String, required: true},                             // Altura
    overal: {type: String, required: true},                             // Overal
    time: {type: String, required: true},                               // Time
    potencial_minimo: {type: String, required: false, default: ''},     // Potencial Minimo
    potencial_maximo: {type: String, required: false, default: ''},     // Potencial Maximo
    pontos_fracos: {type: String, required: false, default: ''},        // Pontos Fracos
    pontos_fortes: {type: String, required: false, default: ''},        // Pontos Fortes
    salario: {type: String, required: false, default: ''},              // Salario
    importancia: {type: String, required: false, default: ''},          // Importancia para o elenco, importancia na base, importancia para o adversario 
    situacao_contrato: {type: String, required: false, default: ''},    // Situação de contrato (Tempo de contrato,interesse em sair)
    tipo: {type: String, required: true},
});

const JogadorModel = mongoose.model('Jogador', JogadorSchema);

class Jogador {
    constructor(body, user) {
        this.body = body;
        this.erros = [];
        this.jogador = null;
        this.user = user
    }

    async adicionar() {

        this.valida();

        if(this.erros.length > 0) return;

        this.jogador = await JogadorModel.create(this.body);
    }

    valida() {
        this.limpa();

        if(!this.body.nome) this.erros.push('Jogador sem nome');
        if(!this.body.posicao) this.erros.push('Jogador sem posicao');
        if(!this.body.idade) this.erros.push('Jogador sem idade');
        if(!this.body.altura) this.erros.push('Jogador sem altura');
        if(!this.body.overal) this.erros.push('Jogador sem overal');
        if(!this.body.time) this.erros.push('Jogador sem time');
        if(!this.body.tipo) this.erros.push('Jogador sem tipo');
    }

    limpa() {

        if(typeof this.body.posicao == "object") {
            this.body.posicao = this.body.posicao.join(', ');
        }
        if(typeof this.body.tipo == "object") {
            this.body.tipo = this.body.tipo.join(', ');
        }

        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            user: this.body.user,
            nome: this.body.nome,
            posicao: this.body.posicao,
            idade: this.body.idade,
            altura: this.body.altura,
            overal: this.body.overal,
            time: this.body.time,
            potencial_minimo: this.body.potencial_minimo,
            potencial_maximo: this.body.potencial_maximo,
            pontos_fracos: this.body.pontos_fracos,
            pontos_fortes: this.body.pontos_fortes,
            salario: this.body.salario,
            importancia: this.body.importancia,
            situacao_contrato: this.body.situacao_contrato,
            tipo: this.body.tipo,
        }
    }

    async editar(id) {
        if(typeof id !== 'string') return;
        this.valida();
        if(this.erros.length > 0) return;
        this.jogador = await JogadorModel.findByIdAndUpdate(id, this.body, {new: true});
    }

    static async buscarPorId(id) {
        if(typeof id !== 'string') return;

        const jogador = await JogadorModel.findById(id);
        return jogador;
    }

    static async buscaJogadores(tipoJogador, usuario) {
        const baseJogadores = await JogadorModel.find({user : usuario}).sort({nome: 1 });
        const jogadores = this.buscaTipo(tipoJogador, baseJogadores);
        return this.organizaElenco(jogadores);
    }

    static buscaTipo(tipoJogador, baseJogadores) {
        let tipos;
        const jogadores = [];

        baseJogadores.forEach(jogador => {
            tipos = jogador.tipo.split(", ");
            if(tipos.includes(tipoJogador)) {
                jogadores.push(jogador);
            }
        });
        return jogadores;
    }

    static organizaElenco(baseJogadores) {
        const posicoesElenco = ['gol', 'ade', 'le', 'zag', 'ld', 'add', 'vol', 'mc', 'me', 'md', 'mei', 'pe', 'pd', 'sa', 'ata'];
        const jogadores = [];
        let posicoes;
        let posicao;

        posicoesElenco.forEach(posicaoElenco => {
            baseJogadores.forEach(jogador => {
                posicoes = jogador.posicao.split(", ");
                posicao = posicoes[0];
                if(posicao.includes(posicaoElenco)) {
                    jogadores.push(jogador);
                }
            });
        });
        return jogadores;
    }

    static async remover(id) {
        if(typeof id !== 'string') return;
        const  jogador = await JogadorModel.findByIdAndDelete({_id: id});
        return jogador;
    }
        
}

module.exports = Jogador;