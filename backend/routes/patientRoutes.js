const express = require("express");
const bcrypt = require("bcrypt");
const Patient = require("../models/Patient");

const router = express.Router();

// ===============================
// REGISTER PATIENT
// ===============================
router.post("/register", async (req, res) => {
try {
const { name, email, password, phone } = req.body;

```
    // Validate required fields
    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({
        email: email.toLowerCase().trim()
    });

    if (existingPatient) {
        return res.status(400).json({
            message: "Patient already registered"
        });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient
    const patient = new Patient({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone.trim()
    });

    // Save patient
    await patient.save();

    console.log("Patient registered successfully:", patient.email);

    // Never send password to frontend
    return res.status(201).json({
        message: "Patient registered successfully",
        patient: {
            _id: patient._id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone
        }
    });

} catch (error) {
    console.error("PATIENT REGISTRATION ERROR:", error);

    return res.status(500).json({
        message: "Registration failed",
        error: error.message
    });
}
```

});

// ===============================
// PATIENT LOGIN
// ===============================
router.post("/login", async (req, res) => {
try {
const { email, password } = req.body;

```
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const patient = await Patient.findOne({
        email: email.toLowerCase().trim()
    });

    if (!patient) {
        return res.status(401).json({
            message: "Email is not registered"
        });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
        password,
        patient.password
    );

    if (!passwordMatch) {
        return res.status(401).json({
            message: "Incorrect password"
        });
    }

    // Login successful
    return res.json({
        message: "Login successful",
        patient: {
            _id: patient._id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone
        }
    });

} catch (error) {
    console.error("PATIENT LOGIN ERROR:", error);

    return res.status(500).json({
        message: "Login failed",
        error: error.message
    });
}
```

});

// ===============================
// GET PATIENT PROFILE
// ===============================
router.get("/:id", async (req, res) => {
try {
const patient = await Patient.findById(req.params.id)
.select("-password");

```
    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    return res.json({
        patient
    });

} catch (error) {
    console.error("GET PATIENT ERROR:", error);

    return res.status(500).json({
        message: "Failed to fetch patient profile",
        error: error.message
    });
}
```

});

// ===============================
// UPDATE PATIENT PROFILE
// ===============================
router.put("/:id", async (req, res) => {
try {
const { name, phone } = req.body;

```
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found"
        });
    }

    if (name) {
        patient.name = name.trim();
    }

    if (phone) {
        patient.phone = phone.trim();
    }

    await patient.save();

    return res.json({
        message: "Patient profile updated successfully",
        patient: {
            _id: patient._id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone
        }
    });

} catch (error) {
    console.error("UPDATE PATIENT ERROR:", error);

    return res.status(500).json({
        message: "Failed to update patient profile",
        error: error.message
    });
}
```

});

// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;
