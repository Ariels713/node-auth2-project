const jwt = require('jsonwebtoken')

function blockUser() {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token
            if(!token) {
                return res.status(401).json({message: "Please Log On first"})
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err){
                    return res.status(401).json({message: "Please Log On first"}) 
                }
                next()
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = blockUser