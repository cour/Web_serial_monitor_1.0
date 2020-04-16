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

    var upChart;
    var initSerial;
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

    function label(x){ // create the labels given a certain amonunt of data and then return it
        var label = ['Time (s)']
        for (i=1; i<x; i++){
            label.push('Serie'+String(i));
        }
        return label;        
    }

    function chart(label){ //update the chart label
        g.updateOptions({labels: label});
    };

    function initializeSerial(){ // Function to wait for the serial port to boot and then get the size of the sent package for the later labeling functions
        $.get('/live-data', function(point) {
            data.pushMax(500,point);
            g.updateOptions({file: data});

            if (2<point[0] && point[0]>2.5){ // wait for the serial port to boot, it takes around 1.5s so we wait a bit more to be sure (2-2.5s)
                if (Object.keys(point).length >= 2){
                    chart(label(Object.keys(point).length));
                    upChart = setInterval(chartUpdate, 30); //repeat function chartUpdate every 30ms
                    clearInterval(initSerial);

                }
            }
        });         
    };

    function chartUpdate(){ // update the chart display 
        $.get('/live-data', function(point) {
            data.pushMax(500,point);
            g.updateOptions({file: data});
        }); 
    };

    $('#record').on('click', function(event) { // when record button pressed then initialize serial port and start reading
        initSerial = setInterval(initializeSerial,30);
    });

    $('#stop_record').on('click', function(event) { //when the stop button is pressed stop the recording and chart update
        clearInterval(upChart);
        data = [];
    });

});

