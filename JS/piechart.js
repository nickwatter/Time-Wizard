

var xValues = ["Project 1", "Project 2", "Project 3", "Project 4", "Others"];
var yValues = [55, 49, 44, 24, 15];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];


// const sum = yValues.reduce((a, b) => a + b, 0);
// const middleText = `${sum}`;

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
        cutoutPercentage: 70,
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
        },
    }
});
//         plugins: {
//             datalabels: {
//                 formatter: function(value, context) {
//                     return context.chart.data.labels[context.dataIndex];
//                 },
//                 color: '#fff',
//                 font: {
//                     size: 16,
//                     weight: 'bold'
//                 }
//             },
//             centerText: {
//                 display: true,
//                 text: middleText,
//                 color: '#000',
//                 font: {
//                     size: 20,
//                     weight: 'bold'
//                 }
//             }
//         }
//     },
//     plugins: [{
//         beforeDraw: function(chart) {
//             var width = chart.chart.width,
//                 height = chart.chart.height,
//                 ctx = chart.chart.ctx;
//             ctx.restore();
//             var fontSize = (height / 120).toFixed(2);
//             ctx.font = fontSize + "em S-serif";
//             ctx.textBaseline = "middle";
//             var text = middleText,
//                 textX = Math.round((width - ctx.measureText(text).width) / 2),
//                 textY = height / 2;
//             ctx.fillText(text, textX, textY);
//             ctx.save();
//         }
//     }]
// });

