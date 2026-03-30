/**
 * ABSU Full-stack Authentication System (JWT Architecture)
 * Connects directly to the Express REST API.
 */

const API_URL = '/api/auth';
const AUTH_TOKEN_KEY = 'absu_auth_token';
const USER_DATA_KEY = 'absu_user_info';

const AuthSystem = {
    // API-based Login
    login: async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: 'Server communication failed' };
        }
    },

    // API-based Registration
    register: async (userData) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: 'Registration failed' };
        }
    },

    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        window.location.href = 'index.html';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },

    getUser: () => {
        const data = localStorage.getItem(USER_DATA_KEY);
        return data ? JSON.parse(data) : null;
    },

    protectRoute: (requiredRole) => {
        if (!AuthSystem.isAuthenticated()) {
            window.location.href = 'portal.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
        if (requiredRole && AuthSystem.getUser().role !== requiredRole) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    updateNavState: () => {
        const portalBtn = document.querySelector('.cta-btn');
        if (AuthSystem.isAuthenticated()) {
            const user = AuthSystem.getUser();
            if (portalBtn) {
                portalBtn.innerText = user.role === 'admin' ? 'System Dashboard' : 'My Account';
                portalBtn.href = user.role === 'admin' ? 'admin.html' : 'portal.html';
                
                if (!document.getElementById('logout-nav-link')) {
                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks) {
                        const li = document.createElement('li');
                        li.id = 'logout-nav-link';
                        li.innerHTML = `<a href="#" onclick="AuthSystem.logout()">Logout</a>`;
                        navLinks.appendChild(li);
                    }
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', AuthSystem.updateNavState);
