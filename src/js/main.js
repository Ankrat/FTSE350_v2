$( document ).ready(function() {

  // Store the DOM elements needed
  var questionE = $('#questionExplore'),
      questionB = $('#questionBenchmark'),
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
      valueB2013 = $('.benchmarkData2013 p'),
      //  Fields to validate
      name = $("#name"),
      company = $("#company"),
      email = $("#email");

  // Store the DOM elements needed


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
          var dataOBJ = createFile();
          var redirectURL = '/saveData.php';

          bQId = questionB.find("option:selected").val();
          sId = sectorB.find("option:selected").val();
          localStorage.setItem("hasSent", true);
          $("#answerQ1").attr( "disabled", "disabled");
          $("#answerQ2").attr( "disabled", "disabled");
          $("#answerQ3").attr( "disabled", "disabled");
          $("#answerQ4").attr( "disabled", "disabled");
          $("#answerQ5").attr( "disabled", "disabled");
          $("#name").attr( "disabled", "disabled");
          $("#company").attr( "disabled", "disabled");
          $("#email").attr( "disabled", "disabled");
          $("#subject").attr( "disabled", "disabled");
          $("#send-data").attr( "disabled", "disabled");
          $("html, body").animate({ scrollTop: $('#chartdiv').offset().top }, 600);
          console.log("dataOBJ = ", dataOBJ);

          $.ajax({
            type: 'POST',
            url: redirectURL, //url of receiver file on server
            dataType: "json",
            data: { data : JSON.stringify(dataOBJ) }, //your data
            success: function(){
              console.log('success data = ', data);
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


    // Explore Update HTML
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
      .html(rep.value2013 + "%")
      .fadeIn();
    value2013
      .hide()
      .html(rep.text2013)
      .fadeIn();

    // Benchmark Update HTML
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

    var myAnswers = ($('.answer'))[bQId - 1],
        myAnswer = ($(myAnswers).find('option:selected')).text();

    valueMyData
      .hide()
      .html(myAnswer)
      .fadeIn();
  });

  // Need to be able to update the graph onChange
  questionB.on('change', function( e ){
    bQId = $(this).val();
    exploreQuestionChange( bQId );
  });

  // Print button
  $(".printpdf").on('click', function(){
    window.print();
  });
  // Utilis
  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  function validateForm(){
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
        allAnswers = $('.answer'),
        name = $("#name").val(),
        company = $("#company").val(),
        email = $("#email").val(),
        subject = $("#subject").text();

    // Create the file to be sent
    var file = [{ selctedQuestion : selectedQText }];

    _.each( allAnswers, function( answer, index ){
      // Create all anwered question
      var fileTmp = {};
      fileTmp.question = $(questions[ (index)]).text(); // question text include please select => need to remove this text hence index + 1
      fileTmp.answer = $(answer).find('option:selected').text();

      // Add them to main file
      file.push( fileTmp );
    });
    file.push({ userName : name});
    file.push({ userCompany : company});
    file.push({ userEmail : email});
    file.push({ userSubject : subject});

    console.log( "file = ", file);

    return file;
  }

});
