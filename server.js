"use strict";

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL);

const digimonSchema = new mongoose.Schema({
  digimonName: String,
  digimonLevel: String,
  digimonImg: String,
});

const digimonModel = mongoose.model("digimon", digimonSchema);

function seedCatCollection() {
  const salamon = new digimonModel({
    digimonName: "Salamon",
    digimonLevel: "Rookie",
    digimonImg: "https://digimon.shadowsmith.com/img/salamon.jpg",
  });

  salamon.save();
}

seedCatCollection();

// proof of life
app.get("/", homePageHandler);
app.get("/digimonapi", getDigimonsAPIHandler);
app.get("/digimon", getDigimonsHandler);
app.post("/digimon", addDigimonHandler);
app.put("/digimon/:id", updateDigimonHandler);
app.delete("/digimon/:id", deleteDigimonHandler);

function homePageHandler(req, res) {
  res.send("you are doing great");
}

async function getDigimonsAPIHandler(req, res) {
    console.log('lllllllll');
  const allDigimons = await axios.get(
    "https://digimon-api.vercel.app/api/digimon"
  );
  res.send(allDigimons.data);
}

async function getDigimonsHandler(req, res) {
  digimonModel.find({}, function (err, allDigimons) {
    if (err) {
      console.log("did not work");
    } else {
      res.send(allDigimons);
    }
  });
}

async function addDigimonHandler(req, res) {
  const { name, img, level } = req.body;

  let newDigimon = await digimonModel.create({
    digimonName:name,
    digimonLevel:level,
    digimonImg:img,
  });
  //   res.send(newDigimon);

  // OR with handling errors
  digimonModel.find({}, (error, allDigimons) => {
    if (error) {
      res.send("not working");
    } else {
      res.send(allDigimons);
    }
  });
}

async function updateDigimonHandler(req, res) {
  const { digimonName, digimonLevel, digimonImg } = req.body;
  const id = req.params.id;

  digimonModel.findByIdAndUpdate(
    id,
    { digimonName, digimonLevel, digimonImg },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        digimonModel.find({}, (error, allDigimons) => {
          if (error) {
            res.send("not working");
          } else {
            res.send(allDigimons);
          }
        });
      }
    }
  );
}

async function deleteDigimonHandler(req, res) {
  console.log("inside deleteHandler");
  console.log(req.params);
  const id = req.params.id;

  digimonModel.deleteOne({ _id: id }).then(() => {
    digimonModel.find({}, (error, allDigimons) => {
      if (error) {
        res.send("not working");
      } else {
        res.send(allDigimons);
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
