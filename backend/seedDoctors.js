                                    const mongoose = require("mongoose");
require("dotenv").config();

const Doctor = require("./models/Doctor");

const doctors = [
    {
        name: "Dr. Ananya Rao",
        email: "ananya.pediatrics@hopsol.com",
        password: "Doctor123",
        phone: "9876500001",
        specialization: "Pediatrics",
        experience: 7,
        available: true
    },
    {
        name: "Dr. Arjun Reddy",
        email: "arjun.orthopedics@hopsol.com",
        password: "Doctor123",
        phone: "9876500002",
        specialization: "Orthopedics",
        experience: 9,
        available: true
    },
    {
        name: "Dr. Karthik Varma",
        email: "karthik.urology@hopsol.com",
        password: "Doctor123",
        phone: "9876500003",
        specialization: "Urology",
        experience: 8,
        available: true
    },
    {
        name: "Dr. Neha Kapoor",
        email: "neha.neurology@hopsol.com",
        password: "Doctor123",
        phone: "9876500004",
        specialization: "Neurology",
        experience: 10,
        available: true
    },
    {
        name: "Dr. Meera Nair",
        email: "meera.dermatology@hopsol.com",
        password: "Doctor123",
        phone: "9876500005",
        specialization: "Dermatology",
        experience: 6,
        available: true
    },
    {
        name: "Dr. Rahul Menon",
        email: "rahul.psychiatry@hopsol.com",
        password: "Doctor123",
        phone: "9876500006",
        specialization: "Psychiatry",
        experience: 8,
        available: true
    },
    {
        name: "Dr. Sneha Iyer",
        email: "sneha.ophthalmology@hopsol.com",
        password: "Doctor123",
        phone: "9876500007",
        specialization: "Ophthalmology",
        experience: 7,
        available: true
    },
    {
        name: "Dr. Divya Reddy",
        email: "divya.gynecology@hopsol.com",
        password: "Doctor123",
        phone: "9876500008",
        specialization: "Gynecology",
        experience: 9,
        available: true
    },
    {
        name: "Dr. Vikram Singh",
        email: "vikram.oncology@hopsol.com",
        password: "Doctor123",
        phone: "9876500009",
        specialization: "Oncology",
        experience: 12,
        available: true
    },
    {
        name: "Dr. Aisha Khan",
        email: "aisha.radiology@hopsol.com",
        password: "Doctor123",
        phone: "9876500010",
        specialization: "Radiology",
        experience: 8,
        available: true
    },
    {
        name: "Dr. Rohit Verma",
        email: "rohit.anesthesiology@hopsol.com",
        password: "Doctor123",
        phone: "9876500011",
        specialization: "Anesthesiology",
        experience: 10,
        available: true
    },
    {
        name: "Dr. Nikhil Rao",
        email: "nikhil.emergency@hopsol.com",
        password: "Doctor123",
        phone: "9876500012",
        specialization: "Emergency Medicine",
        experience: 7,
        available: true
    },
    {
        name: "Dr. Kavya Sharma",
        email: "kavya.familymedicine@hopsol.com",
        password: "Doctor123",
        phone: "9876500013",
        specialization: "Family Medicine",
        experience: 6,
        available: true
    },
    {
        name: "Dr. Aditya Kumar",
        email: "aditya.internalmedicine@hopsol.com",
        password: "Doctor123",
        phone: "9876500014",
        specialization: "Internal Medicine",
        experience: 11,
        available: true
    }
];

async function seedDoctors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        for (const doctorData of doctors) {
            const existing = await Doctor.findOne({
                email: doctorData.email
            });

            if (existing) {
                console.log(`Already exists: ${doctorData.name}`);
            } else {
                await Doctor.create(doctorData);
                console.log(`Added: ${doctorData.name} - ${doctorData.specialization}`);
            }
        }

        console.log("\nAll additional doctors processed successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

seedDoctors();