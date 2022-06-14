const express = require('express')
const path = require('path');
const app = express()
const port = process.env.PORT || 5000;

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))

let publicPath = path.resolve(__dirname, 'src/public'); 
app.use(express.static(publicPath));

// Route to Index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html')
 })