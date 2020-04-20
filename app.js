'user strict'
    const express = require('express')
    const bodyParser = require('body-parser')
    const gems = require('./routes/gems')
    const auth = require('./routes/auth')
    const app = express()

    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

    app.get('/', (req, res)=>{
        res.send("hello world")
    })
    app.use('/auth', auth)
    app.use('/gems', gems) 
    module.exports = app

    /*App.js es más como de las bases para partir en el API
    ya que definimos las constantes que van a relacionarse 
    finalmente entre sí para que todo funcione, también 
    agregamos un "hello world" para verificar que el API
    reacciona de forma correcta y no surgen errores que más
    adelante puedan afectarnos.*/