const express = require("express");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const router = express.Router();


// Admin dashboard statistics
router.get("/dashboard", async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();

        const bookedAppointments = await Appointment.countDocuments({
            status: "Booked"
        });

        const completedAppointments = await Appointment.countDocuments({
            status: "Completed"
        });

        const cancelledAppointments = await Appointment.countDocuments({
            status: "Cancelled"
        });

        res.json({
            totalPatients,
            totalDoctors,
            totalAppointments,
            bookedAppointments,
            completedAppointments,
            cancelledAppointments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch admin dashboard",
            error: error.message
        });
    }
});


// Get all patients
router.get("/patients", async (req, res) => {
    try {
        const patients = await Patient.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            count: patients.length,
            patients
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patients",
            error: error.message
        });
    }
});


// Get all doctors
router.get("/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            count: doctors.length,
            doctors
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctors",
            error: error.message
        });
    }
});


// Get all appointments
router.get("/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "name email phone")
            .populate(
                "doctor",
                "name email phone specialization experience"
            )
            .sort({ appointmentDate: 1 });

        res.json({
            count: appointments.length,
            appointments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch appointments",
            error: error.message
        });
    }
});


// Mark appointment as completed
router.put("/appointments/:id/complete", async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled appointment cannot be completed"
            });
        }

        appointment.status = "Completed";

        await appointment.save();

        res.json({
            message: "Appointment marked as completed",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete appointment",
            error: error.message
        });
    }
});


module.exports = router;