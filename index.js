const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

const { registerUser, signInUser } = require("./DB/login.js");
const { fetchTrailer } = require("./DB/yt.js");

const PORT = process.env.PORT || 2223;

let newMovies = [];
let searchedMovies = [];

async function getlist() {
  await axios
    .get("https://api.gdriveplayer.us/v1/movie/newest")
    .then((response) => {
      const arr = response.data;
      for (let index = 0; index < arr.length - 1; index++) {
        newMovies.push(arr[index]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
getlist();
async function searchMovie(moviename) {
  await axios
    .get(`https://api.gdriveplayer.us/v1/movie/search?title=${moviename}`)
    .then((response) => {
      const arr = response.data;
      for (let index = 0; index < arr.length - 1; index++) {
        searchedMovies.push(arr[index]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(express.static("assets"));
app.use(express.static("resourese"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/pricing", (req, res) => {
  res.render("pricing", { newMovies });
});
app.get("/home", (req, res) => {
  res.render("home", { newMovies });
});

app.get("/search/:moviename", (req, res) => {
  searchedMovies = [];
  searchMovie(req.params.moviename).then(() => {
    res.render("search", { searchedMovies });
  });
});

app.get("/playerrequest/:moviename", (req, res) => {
  let imdbId;
  searchedMovies.forEach((movie) => {
    if (movie.title == req.params.moviename) imdbId = movie.imdb;
  });
  newMovies.forEach((movie) => {
    if (movie.title == req.params.moviename) imdbId = movie.imdb;
  });
  console.log(imdbId);
  res.send(imdbId);
});

app.get("/:moviename/:imdbid", (req, res) => {
  console.log("got a request");
  let imdbId = req.params.imdbid;
  let title = req.params.moviename;
  let movieDetails;
  let movieNameYear;
  let ytTrailerLink;
  newMovies.forEach((movie) => {
    if (movie.title == title) {
      movieNameYear = movie.title + " " + movie.year;
      movieDetails = movie;
    }
  });
  searchedMovies.forEach((movie) => {
    if (movie.title == title) {
      movieNameYear = movie.title + " " + movie.year;
      movieDetails = movie;
    }
  });

  console.log(ytTrailerLink);

  fetchTrailer(movieNameYear).then((ytVLink) => {
    ytTrailerLink = ytVLink;
    res.render("player", {
      movieLink: `http://database.gdriveplayer.us/player.php?imdb=${imdbId}`,
      movie: movieDetails,
      videoId: ytTrailerLink,
    });
  });
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login/signin");
  })
  .post((req, res) => {
    var status = false;
    signInUser(req.body.email, req.body.password, (status, name) => {
      status ? res.redirect("/pricing") : res.redirect("/login");
    });
  });
app
  .route("/register")
  .get((req, res) => {
    res.render("login/register", { email: req.query.email });
  })
  .post((req, res) => {
    if (req.body.key == "started")
      res.redirect(`/register?email=${encodeURIComponent(req.body.email)}`);
    else registerUser(req.body);
    res.redirect("/login");
  });

app.listen(PORT, (req, res) => {
  console.log(`Listening on PORT http://localhost:${PORT}`);
});
