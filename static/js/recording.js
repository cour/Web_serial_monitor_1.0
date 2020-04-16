$(document).ready(function(){
    var stop = true
    var start = false
    var save = false

    function stop_recording(){ 
        $.post('/serial_stop',{
            STOP: 'STOP',
        })

    }

    function start_recording(save) {

        var Baudrate = document.getElementById("baudrate");
        var strBaudrate = Baudrate.options[Baudrate.selectedIndex].text;

        var Comport = document.getElementById("port");
        var strCom = Comport.options[Comport.selectedIndex].text;

        $.post('/serial_start',{
            Baudrate: strBaudrate,
            Comport: strCom,
            save: save.toString(),
        });
    }

    $('#record').on('click', function(event) {
        event.preventDefault(); // To prevent following the link (optional)
        document.getElementById("record").disabled = true;
        document.getElementById("stop_record").disabled = false;
        if (document.getElementById("save_to_csv").checked == true){
            save = true;
        };
        start_recording(save);
        document.getElementById("save_to_csv").disabled = true;

    });
    $('#stop_record').on('click', function(event) {
        event.preventDefault(); // To prevent following the link (optional)
        stop_recording();
        document.getElementById("record").disabled = false;
        document.getElementById("stop_record").disabled = true;
        document.getElementById("save_to_csv").disabled = false;

    });

});