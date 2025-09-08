const {Admin,Teacher,Student} = require('../models/users')
const Event = require('../models/events')

async function getAllUsers() {
    let students,teachers
    
    students = await Student.find({}).select('-password')
    teachers = await Teacher.find({}).select('-password')
    

    return {
        students,
        teachers
    }
}

async function getAllEvents() {
    let events
    try {
        events = await Event.find({}).populate('organizer')
    } catch (error) {
        
    }

    return {
        events
    }
}

async function addUser(req,res) {
    const user = req.body;

    if(user.role == 'teacher'){
        await Teacher.create({
            userName: user.userName,
            password: user.password,
            department: user.teacherDepartment
        })

        return res.redirect('/dashboard')
    }

    if(user.role == 'student'){
        await Student.create({
            userName: user.userName,
            email: user.email,
            password: user.password,
            rollNo: user.rollNo,
            department: user.studentDepartment,
            year: user.year
        })

        return res.redirect('/dashboard')
    }
}

async function editUserForm(req, res) {
    const { id,role } = req.params;

    try {
        let user;
        if (role === "teacher") {
            user = await Teacher.findById(id).select('-password');
        }else {
            user = await Student.findById(id).select('-password');
        }

        if (!user) return res.status(404).send("User not found");

        res.render("editUser.ejs", { user, role });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function updateUser(req,res) {
    const { id } = req.params;
    const {role} = req.query
    const data = req.body;

    try {
        if (role === "teacher") {
        await Teacher.findByIdAndUpdate(id, data, { new: true });
        } else {
        await Student.findByIdAndUpdate(id, data, { new: true });
        }
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user");
    }
}

async function deleteUser(req,res) {
    const { id,role } = req.params;
  

    try {
        if (role === "teacher") {
        await Teacher.findByIdAndDelete(id);
        } else {
        await Student.findByIdAndDelete(id);
        }
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");
    }
}

async function getEventForm(req,res) {
    const id = req.cookies.id
    const teacher = await Teacher.findOne({_id: id})

    res.render('addEvent.ejs',{
        department: teacher.department
    })
}

async function addEvent(req,res) {
    const {title, description, department, organizedFor, startAt, endAt, mode, address} = req.body
    
    const strArr = organizedFor.split(',')

    const students = await Student.find({
        department: { $in:strArr}
    })
    


    await Event.create({
        title,
        description,
        organizer: req.cookies.id,
        department,
        startAt,
        endAt,
        attendes: students.map(s => s._id),
        mode,
        address
    })

    res.redirect('/dashboard')
}

async function showEventForm(req,res) {
    try {
    const event = await Event.findById(req.params.id).populate("attendes");
    if (!event) return res.status(404).send("Event not found");
    
    const attendesArr = event.attendes

    let result = ""
    attendesArr.forEach(val => {
        result += (val.department + ",")
    })
    
    res.render("editEvent", { event,result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching event");
  }
}

async function editEvent(req,res) {
    try {
    const { title, description, department,organizedFor, startAt, endAt, mode, address } = req.body;

    const strArr = organizedFor.split(',')

    const students = await Student.find({
        department: { $in:strArr}
    })
    
    await Event.findByIdAndUpdate(req.params.id, {
      title,
      description,
      department,
      startAt,
      endAt,
      mode,
      address,
      attendes: students.map(s => s._id)
    },{new: true});

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating event");
  }
}

async function deleteEvent(req,res) {
     try {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting event");
  }
}


module.exports = {
    getAllUsers, getAllEvents, addUser, updateUser, deleteUser, editUserForm, getEventForm, addEvent, showEventForm, editEvent, deleteEvent
}