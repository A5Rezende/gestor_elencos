const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const UsuarioModel = mongoose.model('Perfil', UsuarioSchema);

class Usuario {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;

        //console.log(this.body.email);

        this.user = await UsuarioModel.findOne({email: this.body.email});

        if(!this.user) {
            this.errors.push('usuario nao existe');
            return;
        }

        if(!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha invalida');
            this.user = null;
            return;
        }
    }

    async cadastro() {
        this.valida();
        // console.log(this.body);
        if(this.errors.length > 0) return;

        await this.usuarioExiste();

        if(this.errors.length > 0) return;
        
        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);

        this.user = await UsuarioModel.create(this.body);
    }

    async usuarioExiste() {
        this.user = await UsuarioModel.findOne({email: this.body.email});
        if(this.user) this.errors.push('Usuario já existe');
        
    }

    valida() {
        this.limpa();

        // Email precisa ser valido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail invalido');

        // Senha com tamanho correto
        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        } 
    }

    limpa() {
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';                
            } 
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Usuario;