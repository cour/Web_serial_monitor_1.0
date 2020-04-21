function addSerieCheckBox() {

    var seriesAvailable = document.getElementById('serialSelect');
    var check_value = new Array();

    var serie, p, br;

   for(var count in serieLabel)
    {
      serie = document.createElement("input");   
      serie.value=(serieLabel[count] + '</br>');
      serie.type="checkbox";
      serie.id= count;
      p =document.createElement("span");
      p.innerHTML = check_value[count] + ": ";
      br =document.createElement("br");
      seriesAvailable.appendChild(p);
      seriesAvailable.appendChild(serie);
      seriesAvailable.appendChild(br);
   }
}