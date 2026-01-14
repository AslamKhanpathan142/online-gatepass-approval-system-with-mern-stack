const Student = require('../models/student');
const Rector = require("../models/rector")
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const studentLogin = async(req, res) => {
    const {email, password} = req.body;

    try {
        const student = await Student.findOne({email});
        if(!student) return res.status(400).json({message: 'Invalid Email'});

        const isMatch = await bcryptjs.compare(password, student.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Password"});

        const token = jwt.sign({id: student._id, name: student.name, email: student.email, phone: student.phone, department: student.department, course: student.course, year: student.year, hostel: student.hostel}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.status(200).json({message: 'Login Successfully', token, user: {id: student._id, name: student.name, email: student.email, phone: student.phone, department: student.department, course: student.course, year: student.year, hostel: student.hostel,role: student.role}})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const rectorLogin = async(req, res) => {
    const {email, password} = req.body;

     try {
        const rector = await Rector.findOne({email});
        if(!rector) return res.status(400).json({message: 'Invalid Email'});

        const isMatch = await bcryptjs.compare(password, rector.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Password"});

        const token = jwt.sign({id: rector._id, name: rector.name, email: rector.email, hostel: rector.hostel, role: rector.role}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.status(200).json({message: 'Login Successfully', token, user: {id: rector._id, name: rector.name, email: rector.email, hostel: rector.hostel, role: rector.role}})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    studentLogin,
    rectorLogin
}