const express = require("express");
const server = express();
const RouterModel = require("./appModel")
const bcrypt = require("bcryptjs")
const blockUser = require("../middleware/blockUsers");
const JWT = require('jsonwebtoken')
const cookieParser = require("cookie-parser")

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cookieParser())


// Get All Users ✅
server.get("/users", blockUser(), async (req, res, next) => {
    try {
        res.json(await RouterModel.getUser())
    } catch (error) {
        next(error)
    }
})


// Adding New User ✅
server.post('/users', async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await RouterModel.findUserBy({username}).first()
    
        if(user) {
            return res.status(409).json({
                message: "Please Select A different User Name"
            })
        }

        const addNewUser = await RouterModel.addUser({
            username,
            password: await bcrypt.hash(password, 10),
        })

        res.status(201).json(addNewUser)

    } catch (error) {
        next(error)
    }
})

// Loggin IN User ✅
server.post("/login", async (req, res, next) => {
    
    try {
        const {username, password} = req.body
        const user = await RouterModel.findUserBy({username}).first()

        if(!user) {
            return res.status(401).json({
                message:"Username or Password is incorrect"
            })
        }

        const passwordChecker = await bcrypt.compare(password, user.password)

        if(!passwordChecker) {
            return res.status(401).json({
                message:"Username or Password is incorrect"
            })
        }

        const payload = {
            userID: user.id,
            username: user.username, 
            department:"CS"
        }
        
        res.cookie("token", JWT.sign(payload, process.env.JWT_SECRET))
        res.json({
            message:`Welcome ${user.username}, you're logged in. `,
        })

    } catch (error) {
        next(error)
    }
})


//export your router
module.exports = server;
