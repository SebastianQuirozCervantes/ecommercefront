const express = require('express')
const path = require('path');
const app = express()
const port = 5000

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))

let publicPath = path.resolve(__dirname, 'src/public'); //path.join(__dirname, 'public'); también puede ser una opción
app.use(express.static(publicPath));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html')
 })