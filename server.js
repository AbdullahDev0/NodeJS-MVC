const express = require('express');
const connectDB = require('./config/db');
const app = express();

// COnnect to DB
connectDB();

// Init Middleware
app.use(express.json({
    extended: false
}))

app.get('/api/', (req, res)=>res.send('API Running'))

//Define Routes
app.use('/api/user', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/password-reset', require('./routes/api/passwordReset'))
// app.use('/api/profile', require('./routes/api/profile'))
// app.use('/api/posts', require('./routes/api/posts'))


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server Started at Port ${PORT}`))