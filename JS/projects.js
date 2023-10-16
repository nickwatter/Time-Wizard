
const mySideNav = document.getElementById("mySidenav");

mySideNav.addEventListener("mouseover", (event) => {
    console.log("mouse over");
    openNav();
});

mySideNav.addEventListener("mouseout", (event) => {
    closeNav();
});


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    
   // document.getElementById("overlay").classList.add("active");

    // document.body.style.backgroundColor = "rgb(0,0,0,0.2)";
  }
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "110px";
    document.getElementById("main").style.marginLeft = "110px";
    // document.getElementById("overlay").classList.remove("active");

    // document.body.style.backgroundColor = "white";
  }



  function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }