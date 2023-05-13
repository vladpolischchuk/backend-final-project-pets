const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const multer = require('multer');

const authRouter = require("./routes/api/auth");
const petsRouter = require("./routes/api/pets");
const noticesRouter = require("./routes/api/notices");
const friendsRouter = require("./routes/api/friends");
const newsRouter = require("./routes/api/news");

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/openapi.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/pets", petsRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/news", newsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
