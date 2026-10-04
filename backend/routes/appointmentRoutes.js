const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const router = express.Router();


// ===============================
// BOOK APPOINTMENT
// ===============================
router.post("/book", async (req, res) => {
    try {
        // Frontend sends patientId and doctorId
        const {
            patientId,
            doctorId,
            appointmentDate,
            reason
        } = req.body;

        // Validate required fields
        if (!patientId || !doctorId || !appointmentDate) {
            return res.status(400).json({
                message: "Patient, doctor and appointment date are required"
            });
        }

        // Validate patient ID
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({
                message: "Invalid patient ID"
            });
        }

        // Validate doctor ID
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({
                message: "Invalid doctor ID"
            });
        }

        // Check patient
        const patientData = await Patient.findById(patientId);

        if (!patientData) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // Check doctor
        const doctorData = await Doctor.findById(doctorId);

        if (!doctorData) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Check doctor availability
        if (!doctorData.available) {
            return res.status(400).json({
                message: "Doctor is currently unavailable"
            });
        }

        // Convert appointment date
        const date = new Date(appointmentDate);

        if (isNaN(date.getTime())) {
            return res.status(400).json({
                message: "Invalid appointment date"
            });
        }

        // Check whether doctor is already booked
        const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: {
        $eq: date
    },
    status: "Booked"
});

console.log("CHECKING BOOKING:");
console.log("Doctor ID:", doctorId);
console.log("Requested Date:", date);
console.log("Existing Appointment:", existingAppointment);
        if (existingAppointment) {
            return res.status(400).json({
                message: "Doctor is already booked at this time"
            });
        }

        // Create appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            appointmentDate: date,
            reason: reason || ""
        });

        await appointment.save();

        // Get populated appointment
        const populatedAppointment =
            await Appointment.findById(appointment._id)
                .populate(
                    "patient",
                    "name email phone"
                )
                .populate(
                    "doctor",
                    "name email phone specialization experience"
                );

        return res.status(201).json({
            message: "Appointment booked successfully",
            appointment: populatedAppointment
        });

    } catch (error) {
        console.error("BOOK APPOINTMENT ERROR:", error);

        return res.status(500).json({
            message: "Appointment booking failed",
            error: error.message
        });
    }
});


// ===============================
// GET PATIENT APPOINTMENTS
// ===============================
router.get("/patient/:patientId", async (req, res) => {
    try {
        const patientId = req.params.patientId;

        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({
                message: "Invalid patient ID"
            });
        }

        const appointments = await Appointment.find({
            patient: patientId
        })
            .populate(
                "doctor",
                "name email phone specialization experience"
            )
            .sort({
                appointmentDate: 1
            });

        return res.json({
            count: appointments.length,
            appointments: appointments
        });

    } catch (error) {
        console.error("GET PATIENT APPOINTMENTS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch patient appointments",
            error: error.message
        });
    }
});


// ===============================
// GET DOCTOR APPOINTMENTS
// ===============================
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({
                message: "Invalid doctor ID"
            });
        }

        const appointments = await Appointment.find({
            doctor: doctorId
        })
            .populate(
                "patient",
                "name email phone"
            )
            .sort({
                appointmentDate: 1
            });

        return res.json({
            count: appointments.length,
            appointments: appointments
        });

    } catch (error) {
        console.error("GET DOCTOR APPOINTMENTS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch doctor appointments",
            error: error.message
        });
    }
});


// ===============================
// CANCEL APPOINTMENT
// ===============================
router.put("/:id/cancel", async (req, res) => {
    try {
        const appointmentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }

        const appointment =
            await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status === "Cancelled") {
            return res.status(400).json({
                message: "Appointment is already cancelled"
            });
        }

        appointment.status = "Cancelled";

        await appointment.save();

        return res.json({
            message: "Appointment cancelled successfully",
            appointment: appointment
        });

    } catch (error) {
        console.error("CANCEL APPOINTMENT ERROR:", error);

        return res.status(500).json({
            message: "Failed to cancel appointment",
            error: error.message
        });
    }
});


module.exports = router;