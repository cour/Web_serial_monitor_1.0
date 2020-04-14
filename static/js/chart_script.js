$(document).ready(function() {

    Array.prototype.pushMax = function(max, value) {
        var buffer = [];
        var size = Object.keys(value).length;

        if (this.length >= max) {
            this.splice(0, this.length - max + 1);
        }

        for (i=0; i<size ;i++){
            buffer.push(value[i]);
        }
        return this.push(buffer);
    };

    var upChart
    var data = [];
    var g = new Dygraph(document.getElementById("data-container"), data,{
        drawPoints: true,
        showRoller: true,
        legend:'always',
        title: 'Serial Data plotter',
        ylabel: 'Data value',
        xlabel: 'Time (s)',
        strokeWidth: 1.5,
        valueRange: [0, 1030], //low,high pour auto
        labels: ['Time (s)']
    });

    function label(x){
        var label = ['yo']
        for (i=1; i<x; i++){
            label.push('Serie'+String(i));
        }
        return label;        
    }

    function chart(label){
        g.updateOptions({labels: label});
    };


    function chartUpdate(){
        $.get('/live-data', function(point) {
            data.pushMax(500,point);
            g.updateOptions({file: data});

            if (2<point[0] && point[0]>2.5){
                if (Object.keys(point).length >= 2){
                    chart(label(Object.keys(point).length));
                }
            }
        }); 
    };

    $('#record').on('click', function(event) {  
        upChart = setInterval(chartUpdate, 30); //repeat function chartUpdate every 30ms
    });

    $('#stop_record').on('click', function(event) {
        clearInterval(upChart);
        data = [];
    });

});

