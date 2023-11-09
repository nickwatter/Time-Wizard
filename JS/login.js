import { supa } from './supabase.js';


document.addEventListener('DOMContentLoaded', () => {
    console.log("Initialisierung login.js");

    async function getSession() {
        const { data, error } = await supa.auth.getSession();
        if (data.session == null) {
            console.log("No session");
        } else {
            window.location.href = "./dashboard.html";
            console.log(user);
        }
    }

    getSession();

});

    const loginButton = document.getElementById('login-btn');
    const emailInput = document.getElementById('email');
    const errorOutput = document.getElementById('error');

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        login();
    });


async function login() {
    
    if(emailInput.value == "") {
        errorOutput.innerHTML = "Bitte geben Sie eine E-Mail Adresse ein.";
        errorOutput.classList.remove('hidden');
        return;
    }

    const { data, error } = await supa.auth.signInWithOtp({
        email: emailInput.value
    })

    if (error) {
        console.log(error)
        errorOutput.innerHTML = error.message;
        errorOutput.classList.remove('hidden');
        return;
    }

    console.log(data)

    errorOutput.innerHTML = "Ein Magiclink wurde ihnen gesendet. Bitte überprüfen Sie ihre E-Mails.";
    errorOutput.style.color = "green";
    errorOutput.classList.remove('hidden');

}

async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}