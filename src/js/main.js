$( document ).ready(function() {
  // Store the DOM elements needed
  var sector = $('.sector'),
      heading2014 = $('.data2014 h4'),
      value2014 = $('.data2014 p'),
      heading2013 = $('.data2013 h4'),
      value2013 = $('.data2013 p');

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
    heading2014
      .hide()       // Hide existing value
      .html(value)  // Update value
      .fadeIn();    // FadeIn the new content
    value2014
      .hide()
      .html(roleText)
      .fadeIn();
    heading2013
      .hide()
      .html(value)
      .fadeIn();
    value2013
      .hide()
      .html(roleText)
      .fadeIn();
  });

  $("#tab-wrapper").easytabs();

  // Change the dataPlaceholder displayed,
  // according to the tab selected

  var tabLink = $('#tab-wrapper > ul a'),
      benchmarkData = $('.benchmarkData'),
      exploreData = $('.exploreData');

  tabLink.click( function(e){
    var tabSelected = $(this).attr('href');
    if( tabSelected === "#explore-tab" ){
      benchmarkData.fadeOut( 400, function(){
        exploreData.fadeIn();
      });
    }else{
      exploreData.fadeOut( 400, function(){
        benchmarkData.fadeIn();
      });
    }
  });

});
