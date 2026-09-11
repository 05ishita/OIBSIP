const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const message = document.getElementById("message");

const logoutBtn = document.getElementById("logoutBtn");

const dashboardUsername =
    document.getElementById("dashboardUsername");

const dashboardEmail =
    document.getElementById("dashboardEmail");

const dashboardAvatar =
    document.getElementById("dashboardAvatar");

const registerPassword =
    document.getElementById("registerPassword");

const lengthRule =
    document.getElementById("lengthRule");

const numberRule =
    document.getElementById("numberRule");


/* =========================
   STORAGE KEYS
========================= */

const USERS_KEY = "focusAuthUsers";
const SESSION_KEY = "focusAuthSession";


/* =========================
   STORAGE HELPERS
========================= */

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}

function getSession() {
    return localStorage.getItem(SESSION_KEY);
}


/* =========================
   MESSAGE
========================= */

function showMessage(text, type = "error") {

    message.textContent = text;

    message.className = `message show ${type}`;
}

function clearMessage() {

    message.textContent = "";

    message.className = "message";
}


/* =========================
   SHA-256 PASSWORD HASH
========================= */

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte =>
            byte.toString(16).padStart(2, "0")
        )
        .join("");
}


/* =========================
   PASSWORD VALIDATION
========================= */

function isValidPassword(password) {

    const hasEightCharacters =
        password.length >= 8;

    const hasNumber =
        /\d/.test(password);

    return hasEightCharacters && hasNumber;
}


/* =========================
   PASSWORD RULE UI
========================= */

registerPassword.addEventListener(
    "input",
    () => {

        const password =
            registerPassword.value;

        const hasLength =
            password.length >= 8;

        const hasNumber =
            /\d/.test(password);

        lengthRule.classList.toggle(
            "valid",
            hasLength
        );

        numberRule.classList.toggle(
            "valid",
            hasNumber
        );
    }
);


/* =========================
   SWITCH TO LOGIN
========================= */

loginTab.addEventListener(
    "click",
    () => {

        loginTab.classList.add("active");

        registerTab.classList.remove("active");

        loginForm.classList.remove("hidden");

        registerForm.classList.add("hidden");

        authTitle.textContent =
            "Welcome back";

        authSubtitle.textContent =
            "Sign in to continue to your workspace.";

        clearMessage();
    }
);


/* =========================
   SWITCH TO REGISTER
========================= */

registerTab.addEventListener(
    "click",
    () => {

        registerTab.classList.add("active");

        loginTab.classList.remove("active");

        registerForm.classList.remove("hidden");

        loginForm.classList.add("hidden");

        authTitle.textContent =
            "Create your account";

        authSubtitle.textContent =
            "Set up your secure workspace in seconds.";

        clearMessage();
    }
);


/* =========================
   REGISTER
========================= */

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        clearMessage();

        const username =
            document
                .getElementById("registerUsername")
                .value
                .trim();

        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();

        const password =
            registerPassword.value;


        /* Basic validation */

        if (username.length < 3) {

            showMessage(
                "Username must contain at least 3 characters."
            );

            return;
        }


        if (!email.includes("@")) {

            showMessage(
                "Please enter a valid email address."
            );

            return;
        }


        if (!isValidPassword(password)) {

            showMessage(
                "Password must contain at least 8 characters and 1 number."
            );

            return;
        }


        const users = getUsers();


        /* Duplicate check */

        const duplicateUser =
            users.find(
                user =>
                    user.username.toLowerCase() ===
                        username.toLowerCase() ||
                    user.email === email
            );


        if (duplicateUser) {

            showMessage(
                "An account with this username or email already exists."
            );

            return;
        }


        /* Hash password */

        const passwordHash =
            await hashPassword(password);


        /* Store user */

        const newUser = {

            id: Date.now(),

            username,

            email,

            passwordHash,

            createdAt:
                new Date().toISOString()
        };


        users.push(newUser);

        saveUsers(users);


        /* Clear form */

        registerForm.reset();

        lengthRule.classList.remove("valid");

        numberRule.classList.remove("valid");


        showMessage(
            "Account created successfully. You can now sign in.",
            "success"
        );


        /* Switch to login after short delay */

        setTimeout(() => {

            loginTab.click();

            document.getElementById(
                "loginEmail"
            ).value = email;

        }, 700);
    }
);


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        clearMessage();

        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        const users = getUsers();

        const passwordHash =
            await hashPassword(password);


        const user =
            users.find(
                storedUser =>
                    storedUser.email === email &&
                    storedUser.passwordHash === passwordHash
            );


        /* Generic error */

        if (!user) {

            showMessage(
                "Incorrect email or password."
            );

            return;
        }


        /* Create session */

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                userId: user.id,
                loginAt: new Date().toISOString()
            })
        );


        loginForm.reset();

        showDashboard(user);
    }
);


/* =========================
   SHOW DASHBOARD
========================= */

function showDashboard(user) {

    authSection.classList.add("hidden");

    dashboardSection.classList.remove("hidden");


    dashboardUsername.textContent =
        user.username;

    dashboardEmail.textContent =
        user.email;

    dashboardAvatar.textContent =
        user.username
            .charAt(0)
            .toUpperCase();
}


/* =========================
   PROTECTED SESSION CHECK
========================= */

function checkSession() {

    const session =
        getSession();

    if (!session) {

        authSection.classList.remove("hidden");

        dashboardSection.classList.add("hidden");

        return;
    }


    const sessionData =
        JSON.parse(session);

    const users = getUsers();

    const user =
        users.find(
            storedUser =>
                storedUser.id ===
                sessionData.userId
        );


    if (!user) {

        localStorage.removeItem(
            SESSION_KEY
        );

        authSection.classList.remove("hidden");

        dashboardSection.classList.add("hidden");

        return;
    }


    showDashboard(user);
}


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            SESSION_KEY
        );


        dashboardSection.classList.add(
            "hidden"
        );

        authSection.classList.remove(
            "hidden"
        );


        loginTab.click();

        showMessage(
            "You have been logged out successfully.",
            "success"
        );
    }
);


/* =========================
   SHOW / HIDE PASSWORD
========================= */

document
    .querySelectorAll(".toggle-password")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );


                if (input.type === "password") {

                    input.type = "text";

                    button.textContent =
                        "Hide";

                } else {

                    input.type = "password";

                    button.textContent =
                        "Show";
                }
            }
        );
    });


/* =========================
   INITIAL CHECK
========================= */

checkSession();