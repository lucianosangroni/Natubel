require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { dbConnect } = require("./config/dbConnect")
//const { dbSync } = require("./config/dbSync")
const app = express()

app.use(cors())
app.use(express.json())
//app.use(express.static("storage"));

const puerto = process.env.PORT || 3001

app.use("/api", require("./rutas"));

app.listen(puerto, () => {
    console.log(`Inicio Servidor en el puerto: ${puerto}`)
})

dbConnect();
//dbSync();