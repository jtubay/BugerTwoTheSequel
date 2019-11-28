const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"))

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "burgers_db"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
});

app.get("/", (req, res) => {
    connection.query("SELECT * FROM burgers", (err, results) => {
        if(err) throw err;
        res.render("index", {burgers: results})
    })
})

app.post("/api/burgers", function(req, res) {
    const newBurger = req.body;
    connection.query("INSERT INTO burgers (burger_name, devoured) VALUES (?,?)", [newBurger.burger_name, newBurger.devoured], (err, results) => {
      if (err) throw err;
      res.end();
      console.log(newBurger.burger_name)
    })
    
  });
  
  // Delete a quote based off of the ID in the route URL.
  app.delete("/api/burgers/:id", function(req, res) {
    const id = req.params.id
    connection.query("DELETE FROM burgers WHERE ?", { id: id }, (err, results) => {
      if(err) throw err;
      res.end();
    })
  });

  app.put("/api/burgers/:id", function(req, res) {
    const id = req.params.id;
    const devouredState = req.body;
    const query = connection.query(
      "UPDATE burgers SET ? WHERE ?",
      [
        devouredState,
        { id: id}
      ],
      (err, results) => {
        if(err) throw err;
        res.end();
      }
      );
      console.log(query.sql)
  });


app.listen(PORT, () => {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });