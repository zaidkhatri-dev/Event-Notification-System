const express = require("express");
const {
    getAllUsers,
    getAllEvents,
    addUser,
    editUserForm,
    updateUser,
    deleteUser,
    getEventForm,
    addEvent,
    showEventForm,
    editEvent,
    deleteEvent,
} = require("../controllers/dashboard");

const Event = require('../models/events')
const { Student,Admin, Teacher } = require('../models/users');

const dashboardRouter = express.Router();

dashboardRouter.route("/").get(async (req, res) => {
    const { role, payload } = req.user;
    const { students, teachers } = await getAllUsers();
    const { events } = await getAllEvents();

    const admin = await Admin.findById(req.cookies.id).select('-password')
    const teacher = await Teacher.findById(req.cookies.id).select('-password')
    

    if (role == "admin") {
        res.render("adminDashboard.ejs", {
            students: students,
            teachers: teachers,
            events: events,
            admin: admin
        });
    } else if (role == "student") {
        try {
            const studentId = req.cookies.id; // student logged in from session/passport

            // Find only events where this student is in attendes
            const student = await Student.findById(studentId).select('-password');
            // if (!student) {
            //     return res.status(404).send("Student not found");
            // }

            // Find only events where this student's _id is in attendes
            const events = await Event.find({ attendes: student._id }).sort({ startAt: 1 });

            //console.log(events, student);

            res.render("studentDashboard", { student, events });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading student dashboard");
        }
    } else if (role == "teacher") {
        res.render("teacherDashboard.ejs", {
            events: events,
            id: payload._id,
            teacher: teacher
        });
    }
});

dashboardRouter
    .route("/addUser")
    .get((req, res) => {
        res.render("addUser.ejs");
    })
    .post(addUser);

dashboardRouter.route("/editUser/:id/:role").get(editUserForm);

dashboardRouter.route("/editUser/:id").post(updateUser);

dashboardRouter.route("/deleteUser/:id/:role").post(deleteUser);

dashboardRouter.route("/addEvent").get(getEventForm).post(addEvent);

dashboardRouter.route("/editEvent/:id").get(showEventForm).post(editEvent);

dashboardRouter.route("/deleteEvent/:id").post(deleteEvent);

module.exports = dashboardRouter;
