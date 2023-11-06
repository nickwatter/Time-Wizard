var modal = document.getElementById('delete-task');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        background.style.opacity = "0.5";
    }
}