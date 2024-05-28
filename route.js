const express = require('express');
var { Admin, Worker, Appointment, AppointmentAvailability } = require('./db');
var router = express.Router();
var passport = require('passport');

const appointmentsArray = {
    "1": { slotname: "9AM TO 10AM", availability: true, appintmentid: null },
    "2": { slotname: "10AM TO 11AM", availability: true, appintmentid: null },
    "3": { slotname: "11AM TO 12PM", availability: true, appintmentid: null },
    "4": { slotname: "12PM TO 1PM", availability: true, appintmentid: null },
    "5": { slotname: "3PM TO 4PM", availability: true, appintmentid: null },
    "6": { slotname: "4PM TO 5PM", availability: true, appintmentid: null },
    "7": { slotname: "5PM TO 6PM", availability: true, appintmentid: null },
    "8": { slotname: "6PM TO 7PM", availability: true, appintmentid: null },
    "9": { slotname: "7PM TO 8PM", availability: true, appintmentid: null },
    "10": { slotname: "8PM TO 9PM", availability: true, appintmentid: null },
    "11": { slotname: "9PM TO 10PM", availability: true, appintmentid: null },
}

//home endpoint
router.get('/', (req, res) => {
    res.send("Welcome To Our Appointment Booking System");
});

//route for getting all admins from database
router.get('/getadmins', async (req, res) => {
    const admins = await Admin.find({});
    res.send({ status: 200, users: admins });
})

// route for getting admin by username
router.get('/getadmin/:username', async (req, res) => {
    const admin = await Admin.findOne({ username: req.params.username });
    res.send({ status: 200, user: admin });
})

//route for getting all workers from database
router.get('/getworkers', async (req, res) => {
    const workers = await Worker.find({});
    res.send({ status: 200, users: workers });
})

//route for getting worker by username
router.get('/getworker/:username', async (req, res) => {
    const worker = await Worker.findOne({ username: req.params.username });
    res.send({ status: 200, user: worker });
})


// Function to handle booking appointments
const bookAppointment = async (req, res, isAdmin) => {
    const appointmentData = req.body;
    const slotNumber = appointmentData.slotnumber;

    // Check if the user is authenticated
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ status: 401, message: "Not Authorized" });
        }

        const userType = isAdmin ? 'Admin' : 'Worker';
        const userModel = isAdmin ? Admin : Worker;
        const appointmentModel = isAdmin ? Appointment : Appointment;

        // Find the user in the respective collection
        userModel.findOne({ username: user.username }).then((userFound) => {
            if (!userFound) {
                return res.status(200).json({ status: 200, message: `${userType} does not exist` });
            }

            // Check if appointment slot is valid and available
            appointmentModel.findOne({ appointmentid: appointmentData._id, appointmentdate: new Date(appointmentData.appointmentdate.toString()), slotnumber: slotNumber }).then((existingAppointment) => {
                if (existingAppointment || slotNumber > 11) {
                    return res.status(200).json({ status: 200, message: "Invalid slot number" });
                }

                // Create new appointment
                const newAppointment = new appointmentModel({
                    appointmentid: appointmentData._id,
                    username: appointmentData.username,
                    clientname: appointmentData.clientname,
                    age: appointmentData.age,
                    mobile: appointmentData.mobile,
                    service: appointmentData.service,
                    appointmentdate: new Date(appointmentData.appointmentdate.toString()),
                    slotnumber: slotNumber
                });

                // Save the appointment
                newAppointment.save().then((appointment) => {
                    // Handle AppointmentAvailability
                    return res.status(200).json({ status: 200, message: `${userType}: Appointment booked successfully. Appointment ID is ${appointment["_id"]}` });
                }).catch((err) => {
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                });
            });
        });
    })(req, res);
};

// Route for booking appointments by workers
router.post('/bookappointment', async (req, res) => {
    bookAppointment(req, res, false);
});

// Route for admin booking appointments by admins
router.post('/bookappointment/admin', async (req, res) => {
    bookAppointment(req, res, true);
});

// Function to handle fetching appointments
const getAppointments = async (req, res, isAdmin) => {
    // Check if the user is authenticated
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ status: 401, message: "Not Authorized" });
        }

        const userType = isAdmin ? 'Admin' : 'Worker';
        const userModel = isAdmin ? Admin : Worker;

        // Find the user in the respective collection
        userModel.findOne({ username: user.username }).then((userFound) => {
            if (!userFound) {
                return res.status(200).json({ status: 200, message: `${userType} does not exist` });
            }

            const query = isAdmin ? {} : { username: user.username };
            const appointmentModel = isAdmin ? Appointment : Appointment;

            // Fetch appointments based on query
            appointmentModel.find(query).then((appointments) => {
                if (appointments.length > 0) {
                    return res.status(200).json({ status: 200, appointments: appointments });
                } else {
                    return res.status(200).json({ status: 200, message: "No Appointments Found" });
                }
            }).catch((err) => {
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            });
        });
    })(req, res);
};

// Route for fetching appointments by Workers
router.get('/getappointments', async (req, res) => {
    getAppointments(req, res, false);
});

// Route for fetching appointments by Admins
router.get('/getappointments/admin', async (req, res) => {
    getAppointments(req, res, true);
});

// Route for fetching appointments by search category by Workers
router.get('/getappointments/:category/:value', async (req, res) => {
    getAppointments(req, res, false);
});

// Route for fetching appointments by search category by Admins
router.get('/getappointments/admin/:category/:value', async (req, res) => {
    getAppointments(req, res, true);
});

// route for updating appointment
// Worker can update only own made reservations
// Admin can update all reservations
router.put('/updateappointment/:id', async (req, res) => {
    // Check if the user is authenticated
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ status: 401, message: "Not Authorized" });
        }

        const isAdmin = user.isAdmin;
        const userType = isAdmin ? 'Admin' : 'Worker';
        const userModel = isAdmin ? Admin : Worker;
        const appointmentModel = isAdmin ? Appointment : Appointment;
        const id = req.params.id;

        userModel.findOne({ username: user.username }).then((foundUser) => {
            if (!foundUser) {
                return res.status(200).json({ status: 200, message: `${userType} does not exist` });
            }

            // Find the appointment by ID
            appointmentModel.findById(id).then((appointment) => {
                if (!appointment) {
                    return res.status(200).json({ status: 200, message: "Appointment Does Not Exist" });
                }

                // Check if the user has permission to update the appointment
                if (!isAdmin && appointment.username !== user.username) {
                    return res.status(401).json({ status: 401, message: "Not Authorized" });
                }

                // Update the appointment
                appointmentModel.updateOne({ _id: id }, req.body).then((updateres) => {
                    if (updateres) {
                        return res.status(200).json({ status: 200, message: "Appointment Updated Successfully" });
                    } else {
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    }
                }).catch(() => {
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                });
            });
        });
    })(req, res);
});

// Route for deleting appointments
// Worker can delete only own made reservations
// Admin can delete all reservations
router.delete('/deleteappointment/:id', async (req, res) => {
    // Check if the user is authenticated
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ status: 401, message: "Not Authorized" });
        }

        const isAdmin = user.isAdmin;
        const userType = isAdmin ? 'Admin' : 'Worker';
        const userModel = isAdmin ? Admin : Worker;
        const appointmentModel = isAdmin ? Appointment : Appointment;
        const id = req.params.id;

        userModel.findOne({ username: user.username }).then((foundUser) => {
            if (!foundUser) {
                return res.status(200).json({ status: 200, message: `${userType} does not exist` });
            }

            // Find the appointment by ID
            appointmentModel.findById(id).then((appointment) => {
                if (!appointment) {
                    return res.status(200).json({ status: 200, message: "Appointment Does Not Exist" });
                }

                // Check if the user has permission to delete the appointment
                if (!isAdmin && appointment.username !== user.username) {
                    return res.status(401).json({ status: 401, message: "Not Authorized" });
                }

                // Delete the appointment
                appointmentModel.deleteOne({ _id: id }).then((deleteres) => {
                    if (deleteres) {
                        return res.status(200).json({ status: 200, message: "Appointment Deleted Successfully" });
                    } else {
                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                    }
                }).catch(() => {
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                });
            });
        });
    })(req, res);
});

module.exports = router;