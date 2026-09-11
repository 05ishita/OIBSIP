# FocusAuth — Login Authentication System

A polished front-end authentication system developed for the Oasis Infobyte AICTE Internship Program — Level 2 Task 4.

## Features

- User registration
- Username and email validation
- Password validation
- Minimum 8-character password
- At least one number required
- Duplicate username/email detection
- SHA-256 password hashing
- Secure login validation
- Generic incorrect credential error
- Protected dashboard
- Active authentication session
- Logout functionality
- LocalStorage persistence
- Responsive professional UI
- Password visibility toggle
- Mobile-friendly layout

## Security

Passwords are never stored directly in LocalStorage.

Before storage, passwords are converted into a SHA-256 hash using the browser Web Crypto API.

The demo stores:

- Username
- Email
- Password hash
- User ID
- Account creation timestamp

The active authentication session is stored separately.

> Note: This is a client-side internship demonstration. A production authentication system should use a backend, HTTPS, secure cookies, server-side password hashing such as bcrypt/Argon2, rate limiting, and proper session/token management.

## Technologies

- HTML5
- CSS3
- JavaScript
- Web Crypto API
- LocalStorage
- Google Fonts

## Project Structure

```text
WebDev-L2-LoginAuthentication/
│
├── index.html
├── style.css
├── script.js
└── README.md