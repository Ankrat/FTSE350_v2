$( document ).ready(function() {

  // Store the DOM elements needed
  var questionE = $('#questionExplore'),
      questionB = $('#questionBenchmark'),
      sectorE = $('.sector'),
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
      valueB2013 = $('.benchmarkData2013 p'),
      //  Fields to validate
      name = $("#name"),
      company = $("#company"),
      email = $("#email");

  // Explore
  /*
  questionE.change(function( e ){
    var qId = $(this).val();
    exploreQuestionChange( qId );
  });

  sectorE.change(function( e ){

    var sId = $(this).val(),
        rep = exploreSectorChange( sId );

    // Pass the value stored to my elements
    // to update their content accordingly
    heading2014
      .hide()                     // Hide existing value
      .html(rep.value2014 + "%")  // Update value
      .fadeIn();                  // FadeIn the new content
    value2014
      .hide()
      .html(rep.text2014)
      .fadeIn();
    heading2013
      .hide()
      .html(rep.value2013 + "%")
      .fadeIn();
    value2013
      .hide()
      .html(rep.text2013)
      .fadeIn();
  });
  */
$(".action-apply").on('click', function(e){

  e.preventDefault();
  var bQId = 1;
  var sId = 1;


  if( e.target.id === "send-data" ){

    if( localStorage.getItem("hasSent") ){
      console.log("Already applied");
     return
    }else{
      var formError = validateForm();
      if( !_.isEmpty(formError.msg)){
        alert( formError.msg );
      }else{
        var data = createFile();
        var redirectURL = window.location.host + '/saveData.php';

        bQId = questionB.find("option:selected").val();
        sId = sectorB.find("option:selected").val();
        localStorage.setItem("hasSent", true);
        $.ajax({
          type: 'POST',
          url: redirectURL, //url of receiver file on server
          data: data, //your data
          success: function(){
            console.log('done');
            console.log('data = ', data);
          }
        });
      }
    }

  }else{
    bQId = questionE.find("option:selected").val();
    sId = sectorE.find("option:selected").val();
  }

  exploreQuestionChange( bQId );
  rep = exploreSectorChange( sId );

  headingB2014
    .hide()
    .html(rep.value2014 + "%")
    .fadeIn();
  valueB2014
    .hide()
    .html(rep.text2014)
    .fadeIn();
  headingB2013
    .hide()
    .html(rep.value2013 + "%")
    .fadeIn();
  valueB2013
    .hide()
    .html(rep.text2013)
    .fadeIn();

  var myAnswers = ($('.answer'))[bQId - 1];
      myAnswer = ($(myAnswers).find('option:selected')).text();
      console.log("myAnswers = ", myAnswers);
      console.log("myAnswer = ", myAnswer);

  valueMyData
    .hide()
    .html(myAnswer)
    .fadeIn();


  });

  // Benchmark
  /*
  var bQId //Benchmark Question ID
  questionB.change(function( e ){
    bQId = $(this).val();
    exploreQuestionChange( bQId );
  });

  sectorB.change(function( e ){
    var sId = $(this).val(),
    rep = exploreSectorChange( sId );

    // Pass the value stored to my elements
    // to update their content accordingly
    headingB2014
      .hide()                     // Hide existing value
      .html(rep.value2014 + "%")  // Update value
      .fadeIn();                  // FadeIn the new content
    valueB2014
      .hide()
      .html(rep.text2014)
      .fadeIn();
    headingB2013
      .hide()
      .html(rep.value2013 + "%")
      .fadeIn();
    valueB2013
      .hide()
      .html(rep.text2013)
      .fadeIn();

    var myAnswers = ($('.answer'))[bQId - 1];
        myAnswer = ($(myAnswers).find('option:selected')).text();
        console.log("myAnswers = ", myAnswers);
        console.log("myAnswer = ", myAnswer);

    valueMyData
      .hide()
      .html(myAnswer)
      .fadeIn();
  });

  // send data
  $("#send-data").on('click', function(e){
    e.preventDefault();
    if( localStorage.getItem("hasSent") ){
      console.log("Already applied");
     return
    }else{
      // localStorage.setItem("hasSent", true);
      var formError = validateForm();
      if( !_.isEmpty(formError.msg)){
        alert( formError.msg );

      }else{
        var data = createFile();
        var redirectURL = window.location.host + '/saveData.php';
        $.ajax({
          type: 'POST',
          url: redirectURL, //url of receiver file on server
          data: data, //your data
          success: function(){ console.log('done'); console.log('data = ', data);localStorage.setItem("hasSent", true);}
        });

        // return
        // send
      }
    }

  });

*/
  // Tabs definition
  $("#tab-wrapper").easytabs();

  // Store the DOM elements needed
  var tabLink = $('#tab-wrapper > ul a'),
      benchmarkData = $('.benchmarkData'),
      exploreData = $('.exploreData');

  // Change the .dataPlaceholder displayed,
  // according to the tab selected
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

  // Print button
  $(".printpdf").on('click', function(){
    window.print();
  });
  // Utilis
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // var re = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return re.test(email);
  };

  function validateForm(){
    // Check form in order of fields
    // TODO
    // Need to put it onChange for direct validation
    // Handle errors, by default assume false
    var fieldError = {};
        fieldError.msg = '';
        fieldError.name = true;
        fieldError.company = true;
        fieldError.email = true;
        fieldError.subjectct = true;

    if ( _.isEmpty( name.val() ) ){
      fieldError.name = true;
      fieldError.msg += "Enter a name\n";
    }else{
      fieldError.name = false;
    }
    if( _.isEmpty( company.val() ) ){
      fieldError.company = true;
      fieldError.msg += "Enter a company\n";
    }else{
      fieldError.company = false;
    }
    if ( _.isEmpty( email.val() ) || !validateEmail( email.val() ) ){
      fieldError.email = true;
      fieldError.msg += "Enter a valid email\n";
    }else{
      fieldError.email = false;
    }
    if( parseInt( $(sectorB).find('option:selected').val()) === 0 ){
      fieldError.subject = true;
      fieldError.msg += "Select a subject";
    }else{
      fieldError.subject = false;
    }

    return fieldError;
  };

  function createFile(){
    // Store Questions , question selected, answers
    var questions = questionB.find('option');
        selectedQval = questionB.find('option:selected').val();
        selectedQText = questionB.find('option:selected').text();
        allAnswers = $('.answer');

    // Create the file to be sent
    var file = [{ selctedQuestion : selectedQText }];

    _.each( allAnswers, function( answer, index ){
      // Create all anwered question
      var fileTmp = {};
      fileTmp.question = $(questions[ (index + 1)]).text(); // question text include please select => need to remove this text hence index + 1
      fileTmp.answer = $(answer).find('option:selected').text();

      // Add them to main file
      file.push( fileTmp );
    });

    console.log( "file = ", file);

    return file;
  }

});
