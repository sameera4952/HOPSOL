const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// REGISTER PATIENT
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingPatient = await Patient.findOne({ email });

        if (existingPatient) {
            return res.status(400).json({
                message: "Patient already exists"
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
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

// LOGIN PATIENT
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (patient.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            patient: {
                id: patient._id,
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

// GET PATIENT PROFILE
router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .select("-password");

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.json(patient);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient",
            error: error.message
        });
    }
});

// UPDATE PATIENT PROFILE
router.put("/:id", async (req, res) => {
    try {
        const { name, phone } = req.body;

        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        if (name) {
            patient.name = name;
        }

        if (phone) {
            patient.phone = phone;
        }

        await patient.save();

        res.json({
            message: "Profile updated successfully",
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
});

module.exports = router;