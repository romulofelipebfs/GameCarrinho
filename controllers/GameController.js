const Games = require('../models/Games')

module.exports = class GameController{
    static async home(req, res){
        try{
            const gameData = await Games.findAll()
            const games = gameData.map((result) => result.get({plain: true}))
            res.render('games/home', {games})
        }catch(error){
            console.log('Erro ao carregar')
        }
        
    }

    static async create(req, res){
        
        res.render('games/create')
    }

    static async verCarrinho(req, res){
        
        res.render('games/carrinho')
    }

    static async update(req, res){

        const id = req.params.id

        try {
            const game = await Games.findOne({where : {id:id}, raw: true})
            res.render('games/update', {game})
        } catch (error) {
            console.log(error)
        }
        
    }

    static async updateSave(req, res){

        const id = req.body.id

        const game = {
            name: req.body.name,
            price: req.body.price,
            genre: req.body.genre,
            year: req.body.year,
            image: req.body.image
        }

        try {
            await Games.update(game, {where: {id:id}})
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
        

    }

    static async delete(req, res){
        const id = req.body.id

        try {
            if(req.session.userid){
                await Games.destroy({where: {id:id}})
            }
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

    static async addGame(req, res){
        const game = {
            name: req.body.name,
            price: req.body.price,
            genre: req.body.genre,
            year: req.body.year,
            image: req.body.image
        }
        
        try{
            await Games.create(game)
            req.flash('mensage', 'Jogo cadastrado')
            res.redirect('/')
        }catch(error){
            console.log('Erro ao cadastrar o game!' + error)
            
        }
    }
}