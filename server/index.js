require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path')

const {SERVER_PORT} = process.env
const port = process.env.PORT || 5432

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname,"../client/home.html"))
})
app.use('/css', express.static(path.join(__dirname, "../client/index.css")))
app.get('/js', (req,res)=> {
    res.sendFile(path.join(__dirname, "../client/main.js"))
})
app.get('/profile', (req,res)=> {
    res.sendFile(path.join(__dirname,"../client/profile.html"))
})

const {createTables,getAllUsers,loginUser,deleteUser,registerUser,getUser} = require("./controller.js")

app.post('/seed', createTables)
app.get("/users", getAllUsers);
app.post("/users/login", loginUser);
app.post("/users/register", registerUser);
app.delete(`/users/:user_id`, deleteUser);
app.get('/users/login', getUser)


app.listen(port, ()=> console.log(`Up on ${port}`));