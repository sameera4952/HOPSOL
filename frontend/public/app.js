(function () {
'use strict';


const API = 'https://hopsol-backend.onrender.com/api';

// ---------------------------------------------------------
// LOCAL STORAGE HELPERS
// ---------------------------------------------------------

function saveProfile(role, profile) {
    const key = role === 'doctor'
        ? 'doctorProfile'
        : 'patientProfile';

    localStorage.setItem(key, JSON.stringify(profile || {}));
}

function getProfile(role) {
    try {
        return JSON.parse(
            localStorage.getItem(
                role === 'doctor'
                    ? 'doctorProfile'
                    : 'patientProfile'
            )
        ) || {};
    } catch {
        return {};
    }
}

function setActiveProfile(profile) {
    localStorage.setItem(
        'activeProfile',
        JSON.stringify(profile)
    );
}

function getActiveProfile() {
    try {
        return JSON.parse(
            localStorage.getItem('activeProfile')
        ) || {};
    } catch {
        return {};
    }
}

function redirect(path) {
    window.location.href = path;
}

// ---------------------------------------------------------
// STATUS
// ---------------------------------------------------------

function showStatus(message, type) {
    const status = document.getElementById('booking-status');

    if (status) {
        status.className = type || '';
        status.textContent = message;
    } else {
        alert(message);
    }
}

// ---------------------------------------------------------
// API REQUEST
// ---------------------------------------------------------

async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(
            API + url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                ...options
            }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.error ||
                'Something went wrong.'
            );
        }

        return data;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ---------------------------------------------------------
// LANDING PAGE
// ---------------------------------------------------------

function initLandingPage() {
    const patientButton =
        document.getElementById('patientBtn');

    const doctorButton =
        document.getElementById('doctorBtn');

    if (patientButton) {
        patientButton.addEventListener('click', function () {
            redirect('/patient.html');
        });
    }

    if (doctorButton) {
        doctorButton.addEventListener('click', function () {
            redirect('/doctor.html');
        });
    }
}

// ---------------------------------------------------------
// PATIENT LOGIN
// ---------------------------------------------------------

function initPatientLogin() {
    const form = document.querySelector('form');

    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email =
            document.getElementById('email')?.value.trim();

        const password =
            document.getElementById('password')?.value;

        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }

        try {
            const data = await apiRequest(
                '/patients/login',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const patient = data.patient;

            if (!patient) {
                throw new Error(
                    'Patient data was not received from server.'
                );
            }

            const patientId =
                patient._id || patient.id;

            if (!patientId) {
                throw new Error(
                    'Patient ID was not received from server.'
                );
            }

            saveProfile(
                'patient',
                {
                    ...patient,
                    _id: patientId
                }
            );

            setActiveProfile({
                role: 'patient',
                id: patientId,
                email: patient.email
            });

            alert('Login successful!');

            redirect('/login.html');

        } catch (error) {
            alert(
                error.message || 'Login failed.'
            );
        }
    });
}

// ---------------------------------------------------------
// DOCTOR LOGIN
// ---------------------------------------------------------

function initDoctorLogin() {
    const form = document.querySelector('form');

    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email =
            document.getElementById('email')?.value.trim();

        const password =
            document.getElementById('password')?.value;

        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }

        try {
            const data = await apiRequest(
                '/doctors/login',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const doctor =
                data.doctor || data;

            if (!doctor) {
                throw new Error(
                    'Doctor data was not received from server.'
                );
            }

            const doctorId =
                doctor._id || doctor.id;

            if (!doctorId) {
                throw new Error(
                    'Doctor ID was not received from server.'
                );
            }

            saveProfile(
                'doctor',
                {
                    ...doctor,
                    _id: doctorId
                }
            );

            setActiveProfile({
                role: 'doctor',
                id: doctorId,
                email: doctor.email
            });

            console.log(
                'Active doctor:',
                getActiveProfile()
            );

            alert('Doctor login successful!');

            redirect('/doctor2.html');

        } catch (error) {
            console.error(
                'Doctor login error:',
                error
            );

            alert(
                error.message ||
                'Doctor login failed.'
            );
        }
    });
}

// ---------------------------------------------------------
// PATIENT REGISTRATION
// ---------------------------------------------------------

function initRegisterPage() {
    const form = document.querySelector('form');

    if (!form) {
        console.error(
            'Registration form was not found.'
        );
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name =
            document.getElementById('name')?.value.trim();

        const email =
            document.getElementById('email')?.value.trim();

        const password =
            document.getElementById('password')?.value;

        const phone =
            document.getElementById('phone')?.value.trim();

        // Validate all required fields
        if (!name || !email || !password || !phone) {
            alert(
                'Please fill all required fields including phone number.'
            );
            return;
        }

        try {
            console.log('REGISTER DATA:', {
                name: name,
                email: email,
                phone: phone
            });

            const data = await apiRequest(
                '/patients/register',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        phone: phone
                    })
                }
            );

            console.log(
                'Registration response:',
                data
            );

            const patient = data.patient;

            if (!patient) {
                throw new Error(
                    'Patient data was not received from server.'
                );
            }

            const patientId =
                patient._id || patient.id;

            if (!patientId) {
                throw new Error(
                    'Patient ID was not received from server.'
                );
            }

            saveProfile(
                'patient',
                {
                    ...patient,
                    _id: patientId
                }
            );

            setActiveProfile({
                role: 'patient',
                id: patientId,
                email: patient.email
            });

            alert('Registration successful!');

            redirect('/patient.html');

        } catch (error) {
            console.error(
                'Registration error:',
                error
            );

            alert(
                error.message ||
                'Registration failed.'
            );
        }
    });
}

// ---------------------------------------------------------
// FORGOT PASSWORD
// ---------------------------------------------------------

function initForgotPasswordPage() {
    const form = document.querySelector('form');

    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        alert(
            'Password reset is not connected to email service yet. ' +
            'Please contact the administrator.'
        );
    });
}

// ---------------------------------------------------------
// PROFILE PAGE
// ---------------------------------------------------------

async function initProfilePage() {
    const activeProfile =
        getActiveProfile();

    const profileData =
        document.getElementById('profile-data');

    const heading =
        document.getElementById('profile-heading');

    const description =
        document.getElementById('profile-description');

    const dashboardLink =
        document.getElementById('dashboard-link');

    if (!profileData) return;

    if (!activeProfile.id && !activeProfile._id) {
        profileData.innerHTML =
            '<p>Please login first.</p>';
        return;
    }

    const role =
        activeProfile.role || 'patient';

    const isDoctor =
        role === 'doctor';

    const profileId =
        activeProfile.id ||
        activeProfile._id;

    try {
        const endpoint =
            isDoctor
                ? `/doctors/${profileId}`
                : `/patients/${profileId}`;

        const data =
            await apiRequest(endpoint);

        const profile =
            isDoctor
                ? (data.doctor || data)
                : (data.patient || data);

        if (!profile) {
            throw new Error(
                'Profile data was not received from server.'
            );
        }

        const savedProfile = {
            ...profile,
            _id:
                profile._id ||
                profile.id ||
                profileId
        };

        saveProfile(
            role,
            savedProfile
        );

        if (heading) {
            heading.textContent =
                isDoctor
                    ? 'Doctor profile'
                    : 'Patient profile';
        }

        if (description) {
            description.textContent =
                isDoctor
                    ? 'Your professional account information.'
                    : 'Your patient account information.';
        }

        if (dashboardLink) {
            dashboardLink.href =
                isDoctor
                    ? '/doctor2.html'
                    : '/login.html';
        }

        const details =
            isDoctor
                ? [
                    ['Name', profile.name || 'Not provided'],
                    ['Email', profile.email || 'Not provided'],
                    ['Phone', profile.phone || 'Not provided'],
                    ['Specialization', profile.specialization || 'Not provided'],
                    ['Experience', profile.experience ?? '0'],
                    ['Available', profile.available === true ? 'Yes' : 'No'],
                    ['Role', 'Doctor']
                ]
                : [
                    ['Name', profile.name || 'Not provided'],
                    ['Email', profile.email || 'Not provided'],
                    ['Phone', profile.phone || 'Not provided'],
                    ['Role', 'Patient']
                ];

        profileData.innerHTML = '';

        details.forEach(function (detail) {
            const row =
                document.createElement('div');

            row.className =
                'profile-row';

            const label =
                document.createElement('strong');

            label.textContent =
                detail[0];

            const value =
                document.createElement('span');

            value.textContent =
                detail[1];

            row.appendChild(label);
            row.appendChild(value);

            profileData.appendChild(row);
        });

    } catch (error) {
        console.error(
            'Profile error:',
            error
        );

        profileData.innerHTML =
            '<p>Unable to load profile: ' +
            error.message +
            '</p>';
    }
}

// ---------------------------------------------------------
// APPOINTMENT HELPERS
// ---------------------------------------------------------

function getAppointmentDate(appointment) {
    return new Date(
        appointment.appointmentDate
    );
}

function formatDate(dateValue) {
    if (!dateValue) {
        return 'Date not provided';
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return dateValue;
    }

    return date.toLocaleString();
}

// ---------------------------------------------------------
// PATIENT APPOINTMENT LIST
// ---------------------------------------------------------

function renderAppointmentList(
    elementId,
    appointments,
    showCancel
) {
    const container =
        document.getElementById(elementId);

    if (!container) return;

    container.innerHTML = '';

    if (!appointments.length) {
        container.innerHTML =
            '<span class="empty-state">No appointments</span>';
        return;
    }

    appointments.forEach(function (appointment) {
        const item =
            document.createElement('article');

        item.className =
            'appointment-item';

        const doctorName =
            appointment.doctor?.name ||
            appointment.doctorName ||
            'Doctor';

        const patientName =
            appointment.patient?.name ||
            appointment.patientName ||
            'Patient';

        const specialization =
            appointment.doctor?.specialization ||
            appointment.specialist ||
            'Specialist';

        const reason =
            appointment.reason ||
            'No reason provided';

        const status =
            appointment.status ||
            'Booked';

        const heading =
            document.createElement('strong');

        heading.textContent =
            showCancel
                ? `${doctorName} - ${specialization}`
                : `${patientName} - ${specialization}`;

        const details =
            document.createElement('span');

        details.textContent =
            `Date: ${formatDate(
                appointment.appointmentDate
            )} | Reason: ${reason} | Status: ${status}`;

        item.appendChild(heading);
        item.appendChild(details);

        if (
            showCancel &&
            status === 'Booked'
        ) {
            const cancelButton =
                document.createElement('button');

            cancelButton.type =
                'button';

            cancelButton.textContent =
                'Cancel';

            cancelButton.style.marginTop =
                '8px';

            cancelButton.addEventListener(
                'click',
                async function () {
                    const confirmed =
                        confirm(
                            'Are you sure you want to cancel this appointment?'
                        );

                    if (!confirmed) {
                        return;
                    }

                    try {
                        await apiRequest(
                            `/appointments/${appointment._id}/cancel`,
                            {
                                method: 'PUT'
                            }
                        );

                        alert(
                            'Appointment cancelled successfully.'
                        );

                        loadPatientAppointments();

                    } catch (error) {
                        alert(
                            error.message ||
                            'Unable to cancel appointment.'
                        );
                    }
                }
            );

            item.appendChild(cancelButton);
        }

        container.appendChild(item);
    });
}

// ---------------------------------------------------------
// LOAD PATIENT APPOINTMENTS
// ---------------------------------------------------------

async function loadPatientAppointments() {
    const activeProfile =
        getActiveProfile();

    const patientId =
        activeProfile.id ||
        activeProfile._id;

    if (!patientId) {
        renderAppointmentList(
            'booked-appointments',
            [],
            true
        );

        renderAppointmentList(
            'upcoming-appointments',
            [],
            true
        );

        renderAppointmentList(
            'past-appointments',
            [],
            false
        );

        return;
    }

    try {
        const data =
            await apiRequest(
                `/appointments/patient/${patientId}`
            );

        const appointments =
            data.appointments || [];

        const now =
            new Date();

        const booked =
            appointments.filter(function (appointment) {
                return appointment.status === 'Booked';
            });

        const upcoming =
            appointments.filter(function (appointment) {
                return (
                    appointment.status === 'Booked' &&
                    getAppointmentDate(appointment) >= now
                );
            });

        const past =
            appointments.filter(function (appointment) {
                return (
                    appointment.status !== 'Booked' ||
                    getAppointmentDate(appointment) < now
                );
            });

        renderAppointmentList(
            'booked-appointments',
            booked,
            true
        );

        renderAppointmentList(
            'upcoming-appointments',
            upcoming,
            true
        );

        renderAppointmentList(
            'past-appointments',
            past,
            false
        );

    } catch (error) {
        console.error(error);

        const message =
            '<span class="empty-state">Unable to load appointments.</span>';

        const booked =
            document.getElementById(
                'booked-appointments'
            );

        const upcoming =
            document.getElementById(
                'upcoming-appointments'
            );

        const past =
            document.getElementById(
                'past-appointments'
            );

        if (booked) {
            booked.innerHTML = message;
        }

        if (upcoming) {
            upcoming.innerHTML = message;
        }

        if (past) {
            past.innerHTML = message;
        }
    }
}

// ---------------------------------------------------------
// BOOK APPOINTMENT
// ---------------------------------------------------------

function initBookingPage() {
    const form =
        document.getElementById('booking-form');

    const confirmationForm =
        document.getElementById('confirmation-form');

    const bookingArea =
        document.getElementById('booking-area');

    const confirmationArea =
        document.getElementById('confirmation-area');

    const bookButton =
        document.getElementById('book-appointment-button');

    const editButton =
        document.getElementById('edit-booking-button');

    let pendingAppointment = null;

    // Prevent accidental double submission
    let bookingInProgress = false;

    const activeProfile =
        getActiveProfile();

    const activePatientId =
        activeProfile.id ||
        activeProfile._id;

    if (!activePatientId) {
        alert(
            'Please login before booking an appointment.'
        );

        redirect('/patient.html');
        return;
    }

    const patientProfile =
        getProfile('patient');

    const patientNameInput =
        document.getElementById('patient-name');

    if (
        patientNameInput &&
        patientProfile.name
    ) {
        patientNameInput.value =
            patientProfile.name;
    }

    // -----------------------------------------------------
    // BOOK BUTTON
    // -----------------------------------------------------

    if (bookButton) {
        bookButton.addEventListener(
            'click',
            function () {
                if (
                    form &&
                    !form.reportValidity()
                ) {
                    return;
                }

                const selectedSpecialist =
                    document
                        .getElementById('specialist')
                        ?.value
                        ?.trim();

                const selectedDate =
                    document
                        .getElementById('appointment-date')
                        ?.value
                        ?.trim();

                const selectedTime =
                    document
                        .getElementById('appointment-time')
                        ?.value
                        ?.trim();

                if (
                    !selectedSpecialist ||
                    !selectedDate ||
                    !selectedTime
                ) {
                    alert(
                        'Please select specialist, date and time.'
                    );
                    return;
                }

                pendingAppointment = {
                    specialist: selectedSpecialist,
                    date: selectedDate,
                    time: selectedTime
                };

                if (bookingArea) {
                    bookingArea.hidden = true;
                }

                if (confirmationArea) {
                    confirmationArea.hidden = false;

                    confirmationArea.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        );
    }

    // -----------------------------------------------------
    // EDIT BUTTON
    // -----------------------------------------------------

    if (editButton) {
        editButton.addEventListener(
            'click',
            function () {
                if (confirmationArea) {
                    confirmationArea.hidden = true;
                }

                if (bookingArea) {
                    bookingArea.hidden = false;
                }
            }
        );
    }

    // -----------------------------------------------------
    // CONFIRM BOOKING
    // -----------------------------------------------------

    if (confirmationForm) {
        confirmationForm.addEventListener(
            'submit',
            async function (event) {
                event.preventDefault();

                if (bookingInProgress) {
                    console.log(
                        'Booking already in progress. Ignoring duplicate submission.'
                    );
                    return;
                }

                if (!pendingAppointment) {
                    alert(
                        'Please select appointment date and time first.'
                    );
                    return;
                }

                const visitType =
                    document.querySelector(
                        'input[name="visitType"]:checked'
                    )?.value;

                const contactNumber =
                    document
                        .getElementById('contact-number')
                        ?.value
                        .trim();

                const notes =
                    document
                        .getElementById('appointment-notes')
                        ?.value
                        .trim();

                if (
                    !visitType ||
                    !contactNumber
                ) {
                    alert(
                        'Please complete appointment details.'
                    );
                    return;
                }

                if (!activePatientId) {
                    alert(
                        'Patient ID is missing. Please login again.'
                    );
                    return;
                }

                bookingInProgress = true;

                try {
                    const doctorData =
                        await apiRequest('/doctors');

                    const doctors =
                        doctorData.doctors || [];

                    const availableDoctor =
                        doctors.find(function (doctor) {
                            const doctorSpecialization =
                                (
                                    doctor.specialization ||
                                    ''
                                )
                                    .trim()
                                    .toLowerCase();

                            const requiredSpecialization =
                                (
                                    pendingAppointment.specialist ||
                                    ''
                                )
                                    .trim()
                                    .toLowerCase();

                            return (
                                doctorSpecialization ===
                                requiredSpecialization &&
                                doctor.available === true
                            );
                        });

                    if (!availableDoctor) {
                        throw new Error(
                            'No available doctor found for ' +
                            pendingAppointment.specialist
                        );
                    }

                    const doctorId =
                        availableDoctor._id ||
                        availableDoctor.id;

                    if (!doctorId) {
                        throw new Error(
                            'Doctor ID was not received from server.'
                        );
                    }

                    const appointmentDate =
                        `${pendingAppointment.date}T${pendingAppointment.time}:00`;

                    const parsedDate =
                        new Date(appointmentDate);

                    if (
                        Number.isNaN(
                            parsedDate.getTime()
                        )
                    ) {
                        throw new Error(
                            'Invalid appointment date or time.'
                        );
                    }

                    const bookingData = {
                        patientId: activePatientId,
                        doctorId: doctorId,
                        appointmentDate: appointmentDate,
                        reason:
                            notes ||
                            `${visitType} appointment`
                    };

                    console.log(
                        'BOOKING DATA:',
                        bookingData
                    );

                    // Send booking request ONLY ONCE
                    const data =
                        await apiRequest(
                            '/appointments/book',
                            {
                                method: 'POST',
                                body: JSON.stringify(
                                    bookingData
                                )
                            }
                        );

                    console.log(
                        'Appointment booked:',
                        data
                    );

                    showStatus(
                        'Appointment booked successfully.',
                        'success'
                    );

                    alert(
                        'Appointment booked successfully!'
                    );

                    if (confirmationArea) {
                        confirmationArea.hidden = true;
                    }

                    if (bookingArea) {
                        bookingArea.hidden = false;
                    }

                    if (form) {
                        form.reset();
                    }

                    if (confirmationForm) {
                        confirmationForm.reset();
                    }

                    if (
                        patientNameInput &&
                        patientProfile.name
                    ) {
                        patientNameInput.value =
                            patientProfile.name;
                    }

                    pendingAppointment = null;

                    loadPatientAppointments();

                } catch (error) {
                    console.error(
                        'BOOKING ERROR:',
                        error
                    );

                    showStatus(
                        error.message ||
                        'Unable to book appointment.',
                        'error'
                    );

                    alert(
                        error.message ||
                        'Unable to book appointment.'
                    );

                } finally {
                    bookingInProgress = false;
                }
            }
        );
    }

    loadPatientAppointments();
}

// ---------------------------------------------------------
// DOCTOR DASHBOARD
// ---------------------------------------------------------

async function initDoctorDashboard() {
    const appointmentList =
        document.getElementById(
            'appointment-list'
        );

    const pastAppointmentList =
        document.getElementById(
            'past-appointment-list'
        );

    const specialistFilter =
        document.getElementById(
            'specialist-filter'
        );

    if (
        !appointmentList ||
        !pastAppointmentList ||
        !specialistFilter
    ) {
        return;
    }

    const activeProfile =
        getActiveProfile();

    const doctorId =
        activeProfile.id ||
        activeProfile._id;

    if (!doctorId) {
        alert(
            'Please login as a doctor.'
        );

        redirect('/doctor.html');
        return;
    }

    let doctor;

    try {
        const doctorData =
            await apiRequest(
                `/doctors/${doctorId}`
            );

        doctor =
            doctorData.doctor ||
            doctorData;

        if (!doctor) {
            throw new Error(
                'Doctor data was not received from server.'
            );
        }

        saveProfile(
            'doctor',
            {
                ...doctor,
                _id:
                    doctor._id ||
                    doctor.id ||
                    doctorId
            }
        );

    } catch (error) {
        console.error(
            'Doctor profile error:',
            error
        );

        appointmentList.innerHTML =
            '<div class="empty-state">Unable to load doctor profile.</div>';

        pastAppointmentList.innerHTML =
            '<div class="empty-state">Unable to load doctor profile.</div>';

        return;
    }

    const availableSpecialists = [
        'Cardiology',
        'Pediatrics',
        'Orthopedics',
        'Urology',
        'Neurology',
        'Dermatology',
        'Psychiatry',
        'Ophthalmology',
        'Gynecology',
        'Oncology',
        'Radiology',
        'Anesthesiology',
        'Emergency Medicine',
        'Family Medicine',
        'Internal Medicine'
    ];

    specialistFilter.innerHTML = '';

    availableSpecialists.forEach(
        function (specialist) {
            const option =
                document.createElement('option');

            option.value =
                specialist;

            option.textContent =
                specialist;

            specialistFilter.appendChild(option);
        }
    );

    specialistFilter.value =
        doctor.specialization ||
        'Cardiology';

    async function renderDoctorAppointments() {
        try {
            const data =
                await apiRequest(
                    `/appointments/doctor/${doctorId}`
                );

            const appointments =
                data.appointments || [];

            const now =
                new Date();

            const upcoming =
                appointments.filter(
                    function (appointment) {
                        return (
                            appointment.status === 'Booked' &&
                            getAppointmentDate(
                                appointment
                            ) >= now
                        );
                    }
                );

            const past =
                appointments.filter(
                    function (appointment) {
                        return (
                            appointment.status !== 'Booked' ||
                            getAppointmentDate(
                                appointment
                            ) < now
                        );
                    }
                );

            renderDoctorList(
                'appointment-list',
                upcoming
            );

            renderDoctorList(
                'past-appointment-list',
                past
            );

        } catch (error) {
            console.error(
                'Doctor appointments error:',
                error
            );

            appointmentList.innerHTML =
                '<div class="empty-state">Unable to load appointments.</div>';

            pastAppointmentList.innerHTML =
                '<div class="empty-state">Unable to load appointments.</div>';
        }
    }

    function renderDoctorList(
        elementId,
        appointments
    ) {
        const container =
            document.getElementById(elementId);

        if (!container) return;

        container.innerHTML = '';

        if (!appointments.length) {
            container.innerHTML =
                '<div class="empty-state">No appointments</div>';
            return;
        }

        appointments.forEach(
            function (appointment) {
                const item =
                    document.createElement('article');

                item.className =
                    'appointment';

                const patient =
                    appointment.patient || {};

                // Patient
                const patientDiv =
                    document.createElement('div');

                const patientStrong =
                    document.createElement('strong');

                patientStrong.textContent =
                    patient.name || 'Patient';

                const patientSpan =
                    document.createElement('span');

                patientSpan.textContent =
                    patient.email || '';

                patientDiv.appendChild(
                    patientStrong
                );

                patientDiv.appendChild(
                    patientSpan
                );

                // Date
                const dateDiv =
                    document.createElement('div');

                const dateStrong =
                    document.createElement('strong');

                dateStrong.textContent =
                    'Appointment';

                const dateSpan =
                    document.createElement('span');

                dateSpan.textContent =
                    formatDate(
                        appointment.appointmentDate
                    );

                dateDiv.appendChild(
                    dateStrong
                );

                dateDiv.appendChild(
                    dateSpan
                );

                // Reason
                const reasonDiv =
                    document.createElement('div');

                const reasonStrong =
                    document.createElement('strong');

                reasonStrong.textContent =
                    'Reason';

                const reasonSpan =
                    document.createElement('span');

                reasonSpan.textContent =
                    appointment.reason ||
                    'Not provided';

                reasonDiv.appendChild(
                    reasonStrong
                );

                reasonDiv.appendChild(
                    reasonSpan
                );

                // Status
                const actionDiv =
                    document.createElement('div');

                const statusStrong =
                    document.createElement('strong');

                statusStrong.textContent =
                    appointment.status;

                actionDiv.appendChild(
                    statusStrong
                );

                // Complete button
                if (
                    appointment.status === 'Booked'
                ) {
                    const completeButton =
                        document.createElement('button');

                    completeButton.type =
                        'button';

                    completeButton.textContent =
                        'Complete';

                    completeButton.style.marginTop =
                        '8px';

                    completeButton.addEventListener(
                        'click',
                        async function () {
                            const confirmed =
                                confirm(
                                    'Mark this appointment as completed?'
                                );

                            if (!confirmed) {
                                return;
                            }

                            try {
                                await apiRequest(
                                    `/admin/appointments/${appointment._id}/complete`,
                                    {
                                        method: 'PUT'
                                    }
                                );

                                alert(
                                    'Appointment marked as completed.'
                                );

                                renderDoctorAppointments();

                            } catch (error) {
                                alert(
                                    error.message ||
                                    'Unable to complete appointment.'
                                );
                            }
                        }
                    );

                    actionDiv.appendChild(
                        completeButton
                    );
                }

                item.appendChild(
                    patientDiv
                );

                item.appendChild(
                    dateDiv
                );

                item.appendChild(
                    reasonDiv
                );

                item.appendChild(
                    actionDiv
                );

                container.appendChild(
                    item
                );
            }
        );
    }

    specialistFilter.addEventListener(
        'change',
        renderDoctorAppointments
    );

    renderDoctorAppointments();
}

// ---------------------------------------------------------
// PAGE INITIALIZATION
// ---------------------------------------------------------

document.addEventListener(
    'DOMContentLoaded',
    function () {
        const pageId =
            document.body.id;

        if (pageId === 'front-page') {
            initLandingPage();
        }

        if (pageId === 'patient-page') {
            initPatientLogin();
        }

        if (pageId === 'doctor-page') {
            initDoctorLogin();
        }

        if (pageId === 'register-page') {
            initRegisterPage();
        }

        if (pageId === 'forgot-page') {
            initForgotPasswordPage();
        }

        if (pageId === 'profile-page') {
            initProfilePage();
        }

        if (pageId === 'booking-page') {
            initBookingPage();
        }

        if (pageId === 'doctor-dashboard') {
            initDoctorDashboard();
        }
    }
);


})();
