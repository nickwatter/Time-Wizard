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
    fetchProfileData();

});

const emailInput = document.getElementById('profile-email');
const nameInput = document.getElementById('profile-name');

const saveButton = document.getElementById('edit-profile');

saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    updateProfile();
});

async function fetchProfileData(){

    const user = await retrieveUser();

    const { data, error } = await supa
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

    if(error) {
        console.log(error);
        return;
    }

    if(data.length == 0) {
        console.log("No profile found");
        return;
    }

    emailInput.value = data.email;


    if(data.name !== null) {
        nameInput.value = data.name;
    }

}


async function updateProfile() {

    if(nameInput.value == "") {
        alert("Bitte geben Sie einen Namen ein.");
        return;
    }

    const user = await retrieveUser();

    const { data, error } = await supa
    .from('profiles')
    .update({
        name: nameInput.value
    })
    .eq('id', user.id);

    if(error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("Profil wurde erfolgreich aktualisiert.");
    console.log(data);

}

async function retrieveUser() {
    const { data: { user } } = await supa.auth.getUser();
    return user;
}