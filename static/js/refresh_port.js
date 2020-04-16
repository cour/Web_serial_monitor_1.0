$(document).ready(function(){

    load_serial_ports();

    function load_serial_ports() {

        var html_code =''
        $('#port').html('<option value="">Loading...</option>')
        $.get('/serial_ports', function(data){
            html_code += '<option value="">Select...</option>';
            $.each(data, function(index,value){
                html_code += '<option value="'+value+'">'+value+'</option>';
            });
            $('#port').html(html_code);
            document.getElementById("refresh_ports").disabled = false;
            document.getElementById("refresh_spin").className = "";
        });
    }

    $('#refresh_ports').on('click', function(event) {
        event.preventDefault(); // To prevent following the link (optional)
        document.getElementById("refresh_ports").disabled = true;
        document.getElementById("refresh_spin").className = "spinner-border spinner-border-sm";
        load_serial_ports();
    });
});