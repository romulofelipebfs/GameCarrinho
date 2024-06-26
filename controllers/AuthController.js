const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController{
    static register(req, res){
        res.render('auth/register')
    }

    static login(req, res){
        res.render('auth/login')
    }

    static logout(req, res){
        req.session.destroy()
        res.redirect('/')
    }


    static async registerPost(req, res){
        const {name, email, password, confirmpassword} = req.body

        if(password != confirmpassword){
            req.flash('message', 'As senhas devem ser iguais')
            res.render('auth/register')
            return
        }

        const checkIfUserExists = await User.findOne({where : {email:email}})

        if(checkIfUserExists){
            req.flash('message', 'Usuário já existente')
            res.render('auth/register')

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
            isAdmin: false,
        }

        try{
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() =>{
                res.redirect('/')
            })  
        }catch(err){
            console.log(err)
        }

    }

    static async loginPost(req, res){
        const {email, password} = req.body

        const user = await User.findOne({where: {email:email}})

        if(!user){
            req.flash('message', 'Usuário não encontrado')
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message', 'Senha incorreta')
            res.render('auth/login')
            return
        }

        if(user.isAdmin){
            req.session.admin = user.isAdmin
        }

        req.session.userid = user.id

        req.flash('message', 'Login feito com sucesso!')

        req.session.save(()=>{
            res.redirect('/')
        })

    }
}