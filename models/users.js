const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollNo: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
},{timestamps: true})

const Student = mongoose.model('student',studentSchema) 

const teacherSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
})

const Teacher = mongoose.model('teacher', teacherSchema)

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model('admin', adminSchema)

module.exports = {
    Admin,Teacher,Student
}