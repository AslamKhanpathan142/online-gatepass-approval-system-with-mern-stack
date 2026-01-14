const express = require('express')
const connectDB = require('./config/db.js')
const dotenv = require('dotenv')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const Rector = require('./models/rector.js')
const authRoutes = require('./routes/authRoutes.js')
const gatePassRoutes = require('./routes/gatepassRoutes.js')
const studentRoutes = require('./routes/studentRoutes.js')

const app = express()

dotenv.config()
connectDB()

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/gatepass', gatePassRoutes)
app.use('/student', studentRoutes)

app.post('/addRector', async(req, res) => {
    const {name, email, hostel} = req.body;

    try {
        const autoPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(autoPassword, 10);
        const addrector = await Rector.create({
            name,
            email,
            password: hashedPassword,
            hostel
        })
        res.status(200).json({message: "Add Rector Seccessfully", addrector,autoPassword})
    } catch (error) {
        
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})