const express = require("express");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");

const router = express.Router();

// ===============================
// REGISTER DOCTOR
// ===============================
router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            specialization,
            experience
        } = req.body;

        if (!name || !email || !password || !phone || !specialization) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const existingDoctor = await Doctor.findOne({ email });

        if (existingDoctor) {
            return res.status(400).json({
                message: "Doctor already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            phone,
            specialization,
            experience: experience || 0
        });

        await doctor.save();

        res.status(201).json({
            message: "Doctor registered successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                experience: doctor.experience,
                available: doctor.available
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Doctor registration failed",
            error: error.message
        });
    }
});

// ===============================
// DOCTOR LOGIN
// ===============================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.status(401).json({
                message: "Email is not registered"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            doctor.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        res.json({
            message: "Login successful",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                experience: doctor.experience,
                available: doctor.available
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Doctor login failed",
            error: error.message
        });
    }
});

// ===============================
// GET ALL DOCTORS
// ===============================
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .select("-password")
            .sort({ name: 1 });

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

// ===============================
// GET DOCTOR BY ID
// ===============================
router.get("/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .select("-password");

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json(doctor);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctor",
            error: error.message
        });
    }
});

// Get doctor profile
router.get("/profile/:id", async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select("-password");

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctor profile",
            error: error.message
        });
    }
});


// Update doctor profile
router.put("/profile/:id", async (req, res) => {
    try {
        const {
            name,
            phone,
            specialization,
            experience
        } = req.body;

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        if (name) doctor.name = name;
        if (phone) doctor.phone = phone;
        if (specialization) doctor.specialization = specialization;
        if (experience !== undefined) doctor.experience = experience;

        await doctor.save();

        res.json({
            message: "Doctor profile updated successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                experience: doctor.experience,
                available: doctor.available
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor profile",
            error: error.message
        });
    }
});


// Update doctor availability
router.put("/:id/availability", async (req, res) => {
    try {
        const { available } = req.body;

        if (typeof available !== "boolean") {
            return res.status(400).json({
                message: "Available must be true or false"
            });
        }

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        doctor.available = available;

        await doctor.save();

        res.json({
            message: "Doctor availability updated successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                available: doctor.available
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor availability",
            error: error.message
        });
    }
});

module.exports = router;