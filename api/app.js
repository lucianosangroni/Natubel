require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { dbConnect } = require("./config/dbConnect")
//const { dbSync } = require("./config/dbSync")
const app = express()

app.use(cors())
app.use(express.json())

const puerto = process.env.PORT || 3001

app.use("/api", require("./rutas"));

app.listen(puerto, () => {
    console.log(`Inicio Servidor en el puerto: ${puerto}`)
})

//prueba de git, borrar este comentario
dbConnect();
//dbSync();