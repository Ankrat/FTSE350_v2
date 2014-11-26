$( document ).ready(function() {

  // Store the DOM elements needed
  var questionE = $('#questionExplore'),
      questionB = $('#questionBenchmark'),
      questionPanel = $("#questionPanel p:first-child"),
      sectorE = $('#sector'),
      sectorB = $('.subject'),
      heading2014 = $('.data2014 h4'),
      value2014 = $('.data2014 p'),
      heading2013 = $('.data2013 h4'),
      value2013 = $('.data2013 p'),
      headingMyData = $('.benchmarkData h4'),
      valueMyData = $('.benchmarkData p'),
      headingB2014 = $('.benchmarkData2014 h4'),
      valueB2014 = $('.benchmarkData2014 p'),
      headingB2013 = $('.benchmarkData2013 h4'),
      valueB2013 = $('.benchmarkData2013 p');


  $(".action-apply").on('click', function(e){

    e.preventDefault();
    var bQId = 1, sId = 1;
    bQId = questionE.find("option:selected").val();
    sId = sectorE.find("option:selected").val();

    exploreQuestionChange( bQId );
    rep = exploreSectorChange( sId );

    // Explore Update HTML
    questionPanel
      .hide()
      .html(questionE.find("option:selected").text())
      .fadeIn();
    heading2014
      .hide()
      .html(rep.value2014 + "%")
      .fadeIn();
    value2014
      .hide()
      .html(rep.text2014)
      .fadeIn();
    heading2013
      .hide()
      .html(rep.valueSector + "%")
      .fadeIn();
    value2013
      .hide()
      .html(rep.textSector)
      .fadeIn();

  });

});