const Student = require('../models/student')
const Rector = require('../models/rector')
const jwt = require('jsonwebtoken');

const protect = async(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "Please First Login"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // .select('-password') :- -password means password ke alawa
        const student = await Student.findById(decoded.id).select('-password')
        req.user = student;
        next();
    } catch (error) {
        res.status(500).json({message: "Please First Login"})
    }
}


const protectRector = async(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "Please First Login"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const rector = await Rector.findById(decoded.id).select('-password')
        req.user = rector;
        next();
    } catch (error) {
        res.status(500).json({message: "Please First Login"})
    }
}

module.exports = {
    protect,
    protectRector
}