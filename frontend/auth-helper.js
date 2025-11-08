// Authentication Helper Functions

// Get auth token from session
function getAuthToken() {
    const session = localStorage.getItem('wisag_session');
    if (!session) return null;
    try {
        const sessionData = JSON.parse(session);
        return sessionData.token;
    } catch {
        return null;
    }
}

// Get current user from session
function getCurrentUser() {
    const session = localStorage.getItem('wisag_session');
    if (!session) return null;
    try {
        const sessionData = JSON.parse(session);
        return sessionData.user;
    } catch {
        return null;
    }
}

// Check if current user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Make authenticated API request
async function authFetch(url, options = {}) {
    const token = getAuthToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // Handle unauthorized errors
    if (response.status === 401) {
        localStorage.removeItem('wisag_session');
        window.location.href = 'login.html';
        throw new Error('Session expired');
    }

    return response;
}
