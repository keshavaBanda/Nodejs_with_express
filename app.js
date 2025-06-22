const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan')

let movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));
app.use(express.json())
app.use(morgan('dev'));





// Router Handler Functions
const getMovies = (req, res) => {
    res.status(200).json({
        requestedAt: req.requestedAt,
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    })
}

const getMovieById = (req, res) => {
    const id = +req.params.id;
    const foundMovie = movies.find(ele => ele.id == id);
    if (!foundMovie) {
        return res.status(404).json({
            status: 'fail',
            message: 'Movie not found with an Id ' + id
        })
    }

    res.status(201).json({
        status: 'success',
        data: {
            movie: foundMovie
        }
    })
}

const createMovie = (req, res) => {
    newId = movies[movies.length - 1].id + 1;
    newMovie = Object.assign({ id: newId }, req.body)
    movies.push(newMovie);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                movie: newMovie
            }
        })
    })
}

const updateMovie = (req, res) => {
    const id = +req.params.id;
    const movie = movies.find(el => el.id === id);
    const index = movies.indexOf(movie)
    if (!movie) {
        return res.status(200).json({
            status: 'fail',
            message: `No Data found with Id ${id} in Movies Data`
        })
    }

    const updatedMovie = Object.assign(movie, req.body)
    movies[index] = updatedMovie;

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        console.log("I am tryinng to write the file")
        res.status(200).json({
            status: 'success',
            data: {
                movie: updatedMovie
            }
        })
    });
}

const deleteMovie = (req, res) => {
    const id = +req.params.id;
    const movie = movies.find(el => el.id === id);
    const index = movies.indexOf(movie);
    movies.splice(index, 1);

    if (!movie) {
        return res.status(404).json({
            status: "fail",
            message: "Id not found " + id
        })
    }

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        if (err) throw err;
        res.status(204).json({
            status: "success",
            data: null
        })
    })
}

const movieRouter = express.Router(); //ROUTER MIDDLEWARE
// movieRouter is returning the middleware.

movieRouter.route('/')
    .get(getMovies)
    .post(createMovie)

movieRouter.route('/:id')
    .get(getMovieById)
    .patch(updateMovie)
    .delete(deleteMovie)


app.use('/api/v1/movies', movieRouter)

const port = 3000;
app.listen(port, () => {
    console.log("Server Listening with a express framework")
})














//! NOTE POINTS:-
/**
 * express we will use for minimize the node js application
 * expres will return the funciton
 * if that function assign to a variable it return the instance of express object
 * in that object we have a lot of functions to utilizee to minimize the node js project.
 */