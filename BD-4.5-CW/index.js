let express = require("express");
//let cors = require("cors");
let app = express();
let port = process.env.PORT || 3000;
let db;
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");
//app.use(cors());
app.use(express.json());
//Connect to the database
(async () => {
  db = await open({
    filename: "BD-4.5-CW/database.sqlite",
    driver: sqlite3.Database,
  });
})();
//Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD 4.5 CW SQL Comparison Operators" });
});
//To connect sqlite database run: /node BD-4.5-CW/initDB.js
//To run the project: /node BD-4.5-CW
// THE ENPOINTS
//1 /movies/year-actor?releaseYear=2019&actor=Hrithik%20Roshan
async function filterByYearAndActor(releaseYear, actor) {
  let query = "SELECT * FROM movies WHERE release_year = ? AND actor = ?";
  let response = await db.all(query, [releaseYear, actor]);
  return { movies: response };
}
app.get("/movies/year-actor", async (req, res) => {
  let releaseYear = req.query.releaseYear;
  let actor = req.query.actor;
  try {
    let response = await filterByYearAndActor(releaseYear, actor);
    if (response.movies.length === 0) {
      return res.status(404).json({
        message: `No movies found for the given year ${releaseYear} and actor ${actor}.`,
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//2 /movies/award-winning
async function filterAwardWinningMovies() {
  let query = "SELECT * FROM movies WHERE rating >= 4.5 ORDER BY rating";
  let response = await db.all(query);
  return { movies: response };
}
app.get("/movies/award-winning", async (req, res) => {
  try {
    let response = await filterAwardWinningMovies();
    if (response.movies.length === 0) {
      return res.status(404).json({
        message: `No award winning movies found.`,
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//3 /movies/blockbuster
async function fetchBlockbusterMovies() {
  let query =
    "SELECT * FROM movies WHERE box_office_collection >= 100 ORDER BY box_office_collection DESC";
  let response = await db.all(query);
  return { movies: response };
}
app.get("/movies/blockbuster", async (req, res) => {
  try {
    let result = await fetchBlockbusterMovies();
    if (result.movies.length === 0) {
      return res.status(404).json({
        message: `No blockbuster movies found.`,
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Server Port connection Message
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});