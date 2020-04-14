$(document).ready(function(){
    var stop = true
    var start = false

    function stop_recording(){ 
        $.post('/serial_stop',{
            STOP: 'STOP',
        })

    }

    function start_recording() {

        var Baudrate = document.getElementById("baudrate");
        var strBaudrate = Baudrate.options[Baudrate.selectedIndex].text;

        var Comport = document.getElementById("port");
        var strCom = Comport.options[Comport.selectedIndex].text;

        $.post('/serial_start',{
            Baudrate: strBaudrate,
            Comport: strCom,
        });
    }

    $('#record').on('click', function(event) {
        event.preventDefault(); // To prevent following the link (optional)
        document.getElementById("record").disabled = true;
        document.getElementById("stop_record").disabled = false;
        start_recording();

    });
    $('#stop_record').on('click', function(event) {
        event.preventDefault(); // To prevent following the link (optional)
        stop_recording();
        document.getElementById("record").disabled = false;
        document.getElementById("stop_record").disabled = true;

    });

});