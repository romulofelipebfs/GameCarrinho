const session = require("express-session");
const Games = require("../models/Games");

module.exports = class GameController {

  static async home(req, res) {
    try {
      const gameData = await Games.findAll();
      const games = gameData.map((result) => result.get({ plain: true }));
      res.render("games/home", { games });
    } catch (error) {
      console.log("Erro ao carregar");
    }
  }

  static async create(req, res) {
    res.render("games/create");
  }

  static async verCarrinho(req, res) {
    const cart = req.session.cart || [];

    try {
      // Buscar todos os jogos cujos IDs estão no carrinho
      const gameData = await Games.findAll({
        where: {
          id: cart,
        },
      });

      // Converter os resultados para um array de objetos simples
      const games = gameData.map((result) => result.get({ plain: true }));

      // Renderizar a view 'carrinho' com os jogos encontrados
      res.render("games/carrinho", { games });
    } catch (error) {
      console.log("Erro ao carregar os jogos do carrinho: ", error);
      res.redirect("/");
    }
  }

  static async removeFromCart(req, res) {
    const gameId = req.body.id;

    // Certifique-se de que o carrinho exista na sessão
    req.session.cart = req.session.cart || [];

    // Remova o ID do jogo do carrinho
    req.session.cart = req.session.cart.filter((id) => id !== gameId);

    req.flash("message", "Jogo removido do carrinho!");
    req.session.save(() => {
      res.redirect("/");
    });
  }

  static async addToCart(req, res) {

    const gameId = req.body.id;
    // Certifique-se de que o carrinho exista na sessão
    req.session.cart = req.session.cart || [];

    // Verifique se o ID do jogo já está no carrinho
    if (!req.session.cart.includes(gameId)) {
      // Adicione o ID do jogo ao carrinho se ele ainda não estiver lá
      req.session.cart.push(gameId);
      req.flash("message", "Jogo adicionado ao carrinho!");
    } else {
      req.flash("message", "Jogo já está no carrinho!");
    }

    //req.flash("message", "Jogo adicionado ao carrinho!");
    req.session.save(() => {
      res.redirect("/");
    });
  }

  static async update(req, res) {
    const id = req.params.id;

    try {
      const game = await Games.findOne({ where: { id: id }, raw: true });
      res.render("games/update", { game });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateSave(req, res) {
    const id = req.body.id;

    const game = {
      name: req.body.name,
      price: req.body.price,
      genre: req.body.genre,
      year: req.body.year,
      image: req.body.image,
    };

    try {
      await Games.update(game, { where: { id: id } });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(req, res) {
    const id = req.body.id;

    try {
      if (req.session.userid) {
        await Games.destroy({ where: { id: id } });
      }
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }

  static async addGame(req, res) {
    const game = {
      name: req.body.name,
      price: req.body.price,
      genre: req.body.genre,
      year: req.body.year,
      image: req.body.image,
    };

    try {
      await Games.create(game);
      req.flash("mensage", "Jogo cadastrado");
      res.redirect("/");
    } catch (error) {
      console.log("Erro ao cadastrar o game!" + error);
    }
  }
};
