const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const mysql = require("mysql");
const Product = require("./models/Product");
const config = require("./db");
const schema = require("./schema/schema");

const login = require("./routes/login");

mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => { console.log("Database is connected"); },
    err => { console.log(`Can not connect to the database ${err}`); },
);

const app = express();
app.use(passport.initialize());
require("./passport")(passport);

// allow cross-origin requests
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// bind express with graphql
// app.use("/api", checkRoles(["user"]), graphqlHTTP({
app.use("/api", graphqlHTTP({
    schema,
    graphiql: true,
    formatError(err) {
        return {
            message: err.message,
        };
    },
}));

app.use("/login", login);

app.get("/", (req, res) => {
    res.send("hello");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "admin",
//     database: "welding",
// });

// connection.connect();

// connection.query("SELECT * FROM welding.products;", (error, results) => {
//     if (error) {
//         throw error;
//     }
//     // console.log("Results: ", results);
//     results.forEach(result => {
//         const p = new Product({
//             number: result.pno,
//             description: result.desc,
//             inStock: result.inStock,
//             totalShipped: result.totalShipped,
//         });
//         p.save();
//         console.log(p);
//     });
// });

// connection.end();
