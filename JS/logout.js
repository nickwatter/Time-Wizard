import { supa } from './supabase.js';

document.querySelector('#logoutbtn').addEventListener('click', (event) => {

    event.preventDefault();
    logout();

});

async function logout() {
    const { error } = await supa.auth.signOut()
    if (error) {
        console.log(error)
        return
    }
    window.location.href = "index.html";
}