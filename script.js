
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}


function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments')) || [];
}

function getBills() {
    return JSON.parse(localStorage.getItem('bills')) || [];
}


function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}


function saveAppointments(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}


function saveBills(bills) {
    localStorage.setItem('bills', JSON.stringify(bills));
}
document.addEventListener("DOMContentLoaded", function() {
    
    if (localStorage.getItem('loggedInUser')) {
        showDashboard();
    } else {
        
        showRegister();
    }
});


function showRegister() {
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'none';
}


function showLogin() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
}


function showDashboard() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    document.getElementById('userName').innerText = loggedInUser.name;
}


document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let role = document.getElementById('role').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    let users = getUsers();
    if (users.some(user => user.email === email)) {
        alert("User already registered! Please login.");
        return;
    }

    let newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: role
    };

    users.push(newUser);
    saveUsers(users);
    alert("User registered successfully!");

    showLogin(); 
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    let users = getUsers();
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        showDashboard(); 
    } else {
        alert("Invalid credentials! Please try again.");
    }
});

// Logout user
function logout() {
    localStorage.removeItem('loggedInUser');
    showLogin(); 
}

document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let patientId = document.getElementById('patientId').value;
    let doctorId = document.getElementById('doctorId').value;
    let appointmentTime = document.getElementById('appointmentTime').value;

    let appointments = getAppointments();
    let newAppointment = {
        id: Date.now(),
        patientId: patientId,
        doctorId: doctorId,
        appointmentTime: appointmentTime
    };

    appointments.push(newAppointment);
    saveAppointments(appointments);

    alert("Appointment scheduled successfully!");
    document.getElementById('appointmentForm').reset();
});

// View patient history
function viewHistory() {
    const patientId = document.getElementById('historyPatientId').value;
    const appointments = getAppointments();
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<h3>Appointment History:</h3>';
    const filteredAppointments = appointments.filter(a => a.patientId == patientId);

    if (filteredAppointments.length === 0) {
        historyDiv.innerHTML += '<p>No appointments found.</p>';
    } else {
        filteredAppointments.forEach(appointment => {
            historyDiv.innerHTML += `<p>Appointment with Doctor ID: ${appointment.doctorId} on ${appointment.appointmentTime}</p>`;
        });
    }
}

// Generate bill
function generateBill() {
    const patientId = document.getElementById('billPatientId').value;
    const appointments = getAppointments();
    const billDiv = document.getElementById('bill');
    billDiv.innerHTML = '';

    const filteredAppointments = appointments.filter(a => a.patientId == patientId);
    if (filteredAppointments.length === 0) {
        billDiv.innerHTML = '<p>No appointments found for this patient.</p>';
        return;
    }

    let totalCost = filteredAppointments.length * 100; 
    billDiv.innerHTML = `<h3>Bill for Patient ID: ${patientId}</h3>`;
    billDiv.innerHTML += `<p>Total Amount: $${totalCost}</p>`;
    
    let bills = getBills();
    bills.push({
        patientId: patientId,
        amount: totalCost,
        date: new Date().toLocaleString()
    });
    saveBills(bills);
}
