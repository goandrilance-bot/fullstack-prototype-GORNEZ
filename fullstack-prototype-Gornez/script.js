// Authentication State Management
let currentUser = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateUIBasedOnAuthState();
});

// Initialize the app
function initializeApp() {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIBasedOnAuthState();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form submission
    document.getElementById('loginSubmitBtn').addEventListener('click', handleLogin);
    
    // Register form submission
    document.getElementById('registerSubmitBtn').addEventListener('click', handleRegister);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    // Retrieve registered users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { email: user.email, name: user.name, role: user.role };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Close modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();
        
        // Clear form
        document.getElementById('loginForm').reset();
        
        // Update UI
        updateUIBasedOnAuthState();
        
        showAlert(`Welcome back, ${user.name}!`, 'success');
    } else {
        showAlert('Invalid email or password', 'danger');
    }
}

// Handle register
function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const role = document.getElementById('registerRole').value;
    
    if (!name || !email || !password || !role) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showAlert('Email already registered', 'danger');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Close modal
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
    
    // Clear form
    document.getElementById('registerForm').reset();
    
    showAlert(`Account created successfully! You can now log in.`, 'success');
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIBasedOnAuthState();
    showAlert('You have been logged out', 'info');
}

// Update UI based on authentication state
function updateUIBasedOnAuthState() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const contentArea = document.getElementById('content');
    
    if (currentUser) {
        // User is logged in
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'block';
        
        // Update content based on role
        if (currentUser.role === 'admin') {
            contentArea.innerHTML = `
                <h1>Welcome, ${currentUser.name} (Admin)</h1>
                <p>You have admin privileges.</p>
                <div class="alert alert-info">
                    <strong>Admin Dashboard:</strong> You can manage users and system settings.
                </div>
                <h3>Users in System</h3>
                <div id="usersList"></div>
            `;
            displayAllUsers();
        } else {
            contentArea.innerHTML = `
                <h1>Welcome, ${currentUser.name}</h1>
                <p>You are logged in as a regular user.</p>
                <div class="alert alert-success">
                    <strong>Your Role:</strong> ${currentUser.role}
                </div>
            `;
        }
    } else {
        // User is not logged in
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
        
        contentArea.innerHTML = `
            <h1>Welcome to Full-Stack App</h1>
            <p>Please log in to continue.</p>
            <div class="alert alert-info">
                <strong>Demo Mode:</strong> Register a new account or use existing credentials to explore the app.
            </div>
        `;
    }
}

// Display all registered users (admin only)
function displayAllUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersList = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersList.innerHTML = '<p>No registered users yet.</p>';
        return;
    }
    
    let html = '<table class="table table-striped"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>';
    users.forEach(user => {
        html += `<tr><td>${user.name}</td><td>${user.email}</td><td><span class="badge bg-secondary">${user.role}</span></td></tr>`;
    });
    html += '</tbody></table>';
    
    usersList.innerHTML = html;
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fetch example from backend API
function fetchBackendMessage() {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => {
            showAlert(`Backend says: ${data.message}`, 'success');
        })
        .catch(error => {
            console.error('Backend fetch error:', error);
            showAlert('Could not reach backend API.', 'danger');
        });
}

// Show alert notification
function showAlert(message, type = 'info') {
    const contentArea = document.getElementById('content');
    const alertHtml = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    
    contentArea.insertAdjacentHTML('afterbegin', alertHtml);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        const alert = contentArea.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}
