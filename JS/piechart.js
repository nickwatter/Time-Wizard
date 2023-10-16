

var xValues = ["Project 1", "Project 2", "Project 3", "Project 4", "Others"];
var yValues = [55, 49, 44, 24, 15];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];


new Chart("myChart", {
    type: "doughnut",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            borderWidth: 0,
            data: yValues
        }]
    },
    options: {
        title: {
            display: false,
            text: "World Wide Wine Production 2018",
        },
        legend: {
            position: 'left',
            labels: {
                fontColor: 'white',
                fontFamily: 'Sarabun',
                fontSize: 14,
            }
        }
    }
});

