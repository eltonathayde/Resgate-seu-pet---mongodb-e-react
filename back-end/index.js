const express = require('express')
const cors = require('cors')


const app = express()

//  configurando resposta Json

app.use(express.json())


// resolvendo problema de cors 

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//  pasta publica  para imagens  

app.use(express.static('public'))

// Routes
const UserRoutes = require('./routes/UserRoutes')

app.use('/users', UserRoutes)

app.listen(5000)