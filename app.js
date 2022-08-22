require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ;
const database = require("./database.js");

app.use(express.json());

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

const postMovie = async (req, res) => {
  const {title, director,year, color, duration} = req.body;
  await database.query("INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)", [title, director, year, color, duration])
  .then(([results]) => { 
    res.location(`/movies/${results.insertId}`).status(201);
  })
  .catch(err => {
      res.status(500).send("Error saving movie");
  });
 
}

const getUsers = async (req, res) => {
    const users = await database.query("SELECT * FROM users");
    res.json(users);
}

const postUser = async (req, res) => {
  const {firstname, lastname, email, city, language} = req.body;
  await database.query("INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)", [firstname, lastname, email, city, language])
  .then(([results]) => {
    res.location(`/users/${results.insertId}`).status(201);
  }).catch(err => {
      res.status(500).send("Error saving user");
  });
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

const updatedUser = async (req, res) => {
    const id = req.params.id;
    const {firstname, lastname, email, city, language} = req.body;
    await database.query("UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?", [firstname, lastname, email, city, language, id])
    .then(([results]) => {
        if(results.affectedRows === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(204).send();
        }
    }).catch(err => {
        res.status(500).send("Error updating user");
    });
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    await database.query("DELETE FROM users WHERE id = ?", [id])
    .then(([results]) => {
        if(results.affectedRows === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(204).send();
        }
    }).catch(err => {
        res.status(500).send("Error deleting user");
    });
}



app.get("/", Home);
app.get("/movies/:id", MovieById);
app.get("/movies", getMovies);
app.get("/users", getUsers);
app.get("/users/:id", getUserById);

app.post("/movies", postMovie);
app.post("/users", postUser);


app.put("/users/:id", updatedUser);

app.delete("/users/:id", deleteUser);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
