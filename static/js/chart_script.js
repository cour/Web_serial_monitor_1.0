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


    var serieLabel;
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
        labels: ['Time (s)'],
        visibility: [true]
    });

    function label(x){ // create the labels given a certain amonunt of data and then return it
        var label = ['Time (s)']
        var visibility = [];
        for (var i=1; i<x; i++){
            label.push('Serie'+String(i));
            visibility.push(true);
        }
        return [label,visibility];        
    }

    function chart(label){ //update the chart label
        g.updateOptions({labels: label[0]});
        g.updateOptions({visibility: label[1]});
    };

    function initializeSerial(){ // Function to wait for the serial port to boot and then get the size of the sent package for the later labeling functions
        $.get('/live-data', function(point) {
            data.pushMax(250,point);
            g.updateOptions({file: data});

            if (2<point[0] && point[0]>2.5){ // wait for the serial port to boot, it takes around 1.5s so we wait a bit more to be sure (2-2.5s)
                if (Object.keys(point).length >= 2){
                    serieLabel = label(Object.keys(point).length);
                    chart(serieLabel);
                    addSerieCheckBox(serieLabel[0]);
                    serieSelect();
                    clearInterval(initSerial);
                }
            }
        });         
    };

    function chartUpdate(){ // update the chart display 
        $.get('/live-data', function(point) {
            data.pushMax(256,point);

            $("#serialMonitor").append("<option>"+point+"</option>");
            var elmnt = document.getElementById("serialMonitor");
            elmnt.scrollTop = elmnt.scrollHeight;
            g.updateOptions({file: data});
        }); 
    };

    function addSerieCheckBox(serieLabel) {
        $("#serialSelect").empty();
        for(count = 1; count<serieLabel.length; count++)
        {
            $("#serialSelect").append('<div class="custom-control custom-checkbox custom-control-inline"> <input type="checkbox" class="custom-control-input" id="' + serieLabel[count] +'" checked> <label class="custom-control-label"for="'+  serieLabel[count] +'">' + serieLabel[count] +'</label></div>');
        }
    }

    function serieSelect(){
        // get reference to element containing toppings checkboxes
        var el = document.getElementById('serialSelect');

        // get reference to input elements in toppings container element
        var check = el.getElementsByTagName('input');

        // assign function to onclick property of each checkbox
        for (var i=0, len=check.length; i<len; i++) {
            if ( check[i].type === 'checkbox' ) {
                check[i].onclick = function() {
                    var visibility = [];
                    for(var j = 0; j<check.length;j++){
                        if (check[j].checked == true){
                            visibility.push(true);
                        }
                        else{
                            visibility.push(false);
                        }
                    }
                    g.updateOptions({visibility: visibility});
                }
            }
        }
    }


    document.getElementById('refreshYrange').onclick = function() { 
        var Ymin = document.getElementById("Ymin").value;
        var Ymax = document.getElementById("Ymax").value;
        var range = [Ymin,Ymax];
        g.updateOptions({valueRange: range});
    };



    document.getElementById('record').onclick = function() { // when record button pressed then initialize serial port and start reading
        console.log("yo"); 
        data = [];
        initSerial = setInterval(initializeSerial,100);
        upChart = setInterval(chartUpdate, 50); //repeat function chartUpdate every 30ms
    };

    document.getElementById('stop_record').onclick = function() { //when the stop button is pressed stop the recording and chart update
        clearInterval(upChart);
    };
});
