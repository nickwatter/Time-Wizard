  function myFunction() {
    // Declare variables
    var input, filter, grid, a, elements, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    grid = document.getElementsByClassName("projects-grid");
    elements = document.querySelectorAll(".projects-grid a");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < elements.length; i++) {
      div = elements[i].getElementsByTagName("a")[0];
      if (a) {
        txtValue = div.dataset.projectName;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          div[i].style.display = "";
        } else {
          div[i].style.display = "none";
        }
      }
    }
  }