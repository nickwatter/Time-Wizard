import { supa } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initialisierung profile.js");

    async function getSession() {
        const { data, error } = await supa.auth.getSession();
        if (data.session == null) {
            window.location.href = "./index.html";
            console.log("No session");
        } else {
            const user = await retrieveUser();
            console.log(user);
        }
    }

    getSession();
    

});





async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}