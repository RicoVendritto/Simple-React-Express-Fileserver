const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage }).array("file");

app.get("/", function(req, res) {
  const data = path.join(__dirname, "public");
  fs.readdir(data, function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function(file) {
      return res.json(file);
    });
  });
});

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.listen(8000, function() {
  console.log("App running on port 8000");
});
