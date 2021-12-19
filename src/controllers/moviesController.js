const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment');
const {validationResult} = require('express-validator');

//Otra forma de llamar a los modelos
const Movies = db.Movie;
const Genres = db.Genre;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
            .then(allGenres => res.render("moviesAdd", {allGenres} ))
            .catch(error => res.send(error))
    },
    create: function (req, res) {
        db.Movie.create(req.body)
            .then( () => res.redirect("/movies"))
            .catch(error => res.send(error))
    },
    edit: function(req,res) {
        let pelicula = db.Movie.findByPk(req.params.id)
        let generos = db.Genre.findAll()

        Promise.all([pelicula, generos])
            .then( ([Movie, allGenres]) => res.render("moviesEdit", 
            {
                Movie,
                allGenres,
                date : moment(Movie.release_date).format("YYYY-MM-DD")
            }))
            .catch(error => res.send(error))
    },
    update: function (req,res) {
        db.Movie.update(req.body, 
            {
                where: { id: req.params.id }
            })
            .then( () => res.redirect("/movies"))
            .catch(error => res.send(error))
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
        .then(Movie =>{
            res.render('moviesDelete',{
                Movie,
            })
        })
    },
    destroy: function (req, res) {
        db.Movie.destroy(
            {
                where : {
                    id : req.params.id
                }
            }
        ).then(response => {
            res.redirect('/movies')
        })
        .catch(error => console.log(error)) 
    }

}

module.exports = moviesController;