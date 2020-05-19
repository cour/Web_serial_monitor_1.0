$(document).ready(function() {

    $('#upload').on('click', function(event) {

        console.log(document.getElementById("input").files[0].name);

        var full_graph = new Dygraph(document.getElementById("fullGraph"), "../recorded/"+ document.getElementById("input").files[0].name, // path to CSV file
                                     {}
                                    );
    });

});