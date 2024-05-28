const mongoose = require('mongoose');
require('dotenv').config();

//database connection
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function () {
	console.log("Connection Successful!");
});

//model and schema creation
var AdminSchema = mongoose.Schema({
	name: String,
	username: { type: String, unique: true },
	password: String,
	email: { type: String, unique: true },
});

var WorkerSchema = mongoose.Schema({
	name: String,
	username: { type: String, unique: true },
	password: String,
	email: { type: String, unique: true },
});

var AppointmentSchema = mongoose.Schema({
	username: String,
	clientname: String,
    age: Number,
    mobile: Number,
    service: String,
	appointmentdate: {
		type: Date,
		default: () => new Date("<YYYY-mm-dd>"),
		required: 'Must Have Appointment Date'
	},
	slotnumber: {
		type: Number,
		required: 'Must Have Slot Number'
	}
}, { timestamps: true })

var AppointmentAvailabilitySchema = mongoose.Schema({
	appointmentdate: {
		type: Date,
		ref: 'Appointment'
	},
	slotnumber: {
		type: Number,
		ref: 'Appointment'
	},
	appointmentsavailable: {
		type: Object
	}
}, { timestamps: true })

var Admin = mongoose.model('Admin', AdminSchema, 'admin');
var Worker = mongoose.model('Doctor', WorkerSchema, 'worker');
var Appointment = mongoose
					.model('Appointment', AppointmentSchema, 'appointments');
var AppointmentAvailability = mongoose
							.model('AppointmentAvailability', 
										AppointmentAvailabilitySchema,
									'appointmentavailability');

module.exports = { db, Admin, Worker, Appointment, AppointmentAvailability };