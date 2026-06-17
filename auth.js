/**
 * ABSU Full-stack Authentication System (JWT Architecture)
 * Connects directly to the Express REST API.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration - Replace with your actual Supabase project URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://abcde12345.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AUTH_TOKEN_KEY = 'absu_auth_token';
const USER_DATA_KEY = 'absu_user_info';


const AuthSystem = {
    // API-based Login
    login: async (email, password) => {
        try { //
            const { data, error } = await supabase.auth.signInWithPassword({ email, password }); //
            if (error) { //
                return { success: false, message: error.message }; //
            } else if (data.session && data.user) { //
                localStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token); //
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user)); //
                return { success: true, user: data.user }; //
            } else { //
                return { success: false, message: 'Login failed: No session or user data.' }; //
            }
        } catch (err) {
            return { success: false, message: 'Server communication failed' };
        }
    },

    // API-based Registration
    register: async (userData) => {
        try { //
            const { data, error } = await supabase.auth.signUp({ //
                email: userData.email, //
                password: userData.password, //
                options: { data: { name: userData.name, faculty: userData.faculty, department: userData.department, role: userData.role } } //
            }); //
            if (error) { //
                return { success: false, message: error.message }; //
            } else if (data.session && data.user) { //
                localStorage.setItem(AUTH_TOKEN_KEY, data.session.access_token); //
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user)); //
                return { success: true, user: data.user }; //
            } else { //
                return { success: false, message: 'Registration failed: No session or user data.' }; //
            }
        } catch (err) {
            return { success: false, message: 'Registration failed' };
        }
    },

    logout: () => {
        supabase.auth.signOut(); //
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        window.location.href = 'index.html';
    },

    isAuthenticated: () => {
        // Check for both local storage token and a valid Supabase session
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const user = localStorage.getItem(USER_DATA_KEY);
        return !!token && !!user;
    },

    getUser: () => {
        const data = localStorage.getItem(USER_DATA_KEY);
        if (data) {
            const user = JSON.parse(data);
            // Supabase stores custom user data in user_metadata
            return { ...user, ...user.user_metadata };
        }
        return null;

    },

    protectRoute: (requiredRole) => {
        if (!AuthSystem.isAuthenticated()) {
            window.location.href = 'portal.html?redirect=' + encodeURIComponent(window.location.href);
            return false;
        }
        const user = AuthSystem.getUser();
        if (requiredRole && (!user || user.role !== requiredRole)) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    updateNavState: () => {
        const portalBtn = document.querySelector('.cta-btn');
        if (AuthSystem.isAuthenticated()) {
            const user = AuthSystem.getUser();
            if (portalBtn && user) {
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

// Listen for Supabase auth state changes to keep local storage in sync
supabase.auth.onAuthStateChange((event, session) => { //
    if (session) { //
        localStorage.setItem(AUTH_TOKEN_KEY, session.access_token); //
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(session.user)); //
    } else { //
        localStorage.removeItem(AUTH_TOKEN_KEY); //
        localStorage.removeItem(USER_DATA_KEY); //
    }
    AuthSystem.updateNavState();
});

// Initial call to update nav state on page load
document.addEventListener('DOMContentLoaded', AuthSystem.updateNavState); //
