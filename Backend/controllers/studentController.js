const Student = require('../models/student')
const bcrypt = require('bcryptjs')

const addStudent = async(req, res) => {
    const hostelName = req.user.hostel;
    const {name, email,rollNumber, phone, department, course, year} = req.body;

    try {
        const autoPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(autoPassword, 10);

        const student = await Student.create({
            name,
            email,
            rollNumber,
            phone,
            password: hashedPassword,
            department,
            course,
            year,
            hostel: hostelName,
        })
        res.status(200).json({message: "Register Student Seccessfully",student,autoPassword})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const viewStudent = async(req, res) => {
    const hostel = req.user.hostel;

    try {
        const student = await Student.find({hostel})
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    addStudent,
    viewStudent
}