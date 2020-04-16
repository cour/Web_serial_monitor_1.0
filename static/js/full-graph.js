$(document).ready(function() {
    var initSerial;
    var data = [[1,2]];
    var full_graph = new Dygraph(document.getElementById("full-graph"), data,{
        drawPoints: true,
        showRoller: true,
        legend:'always',
        title: 'Serial Data plotter',
        ylabel: 'Data value',
        xlabel: 'Time (s)',
        strokeWidth: 1.5,
        valueRange: [0, 1030], //low,high pour auto
        labels: ['Time (s)','serie_1'],
        });
});