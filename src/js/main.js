$( document ).ready(function() {
  // Store the DOM elements needed
  var sector = $('.sector'),
      blueHeading = $('.data2014 h4'),
      blueValue = $('.data2014 p'),
      orangeHeading = $('.data2013 h4'),
      orangeValue = $('.data2013 p');

  // Listen to the change of sectors
  sector.change( function(){
    // Store the selected sector
    var sectorSelected = $(this).find(":selected");

    // Assign the values from this selcted setor
    // to my variables
    var value = sectorSelected.data('value'),
        roleText = sectorSelected.data('role');

    // Pass the value stored to my elements
    // to update their content accordingly
    blueHeading
      .hide()       // Hide existing value
      .html(value)  // Update value
      .fadeIn();    // FadeIn the new content
    blueValue
      .hide()
      .html(roleText)
      .fadeIn();
    orangeHeading
      .hide()
      .html(value)
      .fadeIn();
    orangeValue
      .hide()
      .html(roleText)
      .fadeIn();
  });

  $("#tab-wrapper").easytabs();

});
