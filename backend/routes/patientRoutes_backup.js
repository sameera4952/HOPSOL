const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// ===============================
// REGISTER PATIENT
// ===============================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingPatient = await Patient.findOne({ email });

        if (existingPatient) {
            return res.status(400).json({
                message: "Patient already registered"
            });
        }

        const patient = new Patient({
            name,
            email,
            password,
            phone
        });

        await patient.save();

        res.status(201).json({
            message: "Patient registered successfully",
            patient
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ===============================
// PATIENT LOGIN
// ===============================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const patient = await Patient.findOne({ email });

        // Email not found
        if (!patient) {
            return res.status(401).json({
                message: "Email is not registered"
            });
        }

        // Password incorrect
        if (patient.password !== password) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        // Login successful
        res.json({
            message: "Login successful",
            patient: {
                name: patient.name,
                email: patient.email,
                phone: patient.phone
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;