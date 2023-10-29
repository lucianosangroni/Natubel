require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())

const puerto = process.env.PUERTO || 3000

app.listen(puerto, () => {
    console.log("hola")
})