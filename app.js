require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ;
const database = require("./database.js");



const Home = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const MovieById = (req, res) => {
   const id = req.params.id;
    database.query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([results])=> {
        if(results[0] != null) {
            res.json(results[0]);
        } else {
            res.status(404).send("Movie not found");
        }
    }).catch(err => {
        console.error(err);
    });
}

const getMovies = async (req, res) => {
    const movies = await database.query("SELECT * FROM movies");
    res.json(movies);
}


const getUsers = async (req, res) => {
    const users = await database.query("SELECT * FROM users");
    res.json(users);
}


const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await database.query("SELECT * FROM users WHERE id = ?", [id]);
    if(user[0] != null) {
        res.json(user[0]);
    } else {
        res.status(404).send("User not found");
    }
}



app.get("/", Home);
app.get("/movies/:id", MovieById);
app.get("/movies", getMovies);
app.get("/users", getUsers);
app.get("/users/:id", getUserById);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
