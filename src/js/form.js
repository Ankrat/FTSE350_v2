// user-data
var name         ,
    company      ,
    email        ,
    subject      ,
    subjectVal   ;

// user-answers
var questionQ1   ,
    questionQ2   ,
    questionQ3   ,
    questionQ4   ,
    questionQ5   ,
    answerQ1     ,
    answerQ2     ,
    answerQ3     ,
    answerQ4     ,
    answerQ5     ;

$("#send-data").on('click', function(){
  //Get the values from the form
  name         = $("#name").val();
  company      = $("#company").val();
  email        = $("#email").val();
  subject      = $("#subject").find('option:selected').text();
  subjectVal   = $("#subject").find('option:selected').val();

  questionQ1   = $("#questionQ1").text();
  questionQ2   = $("#questionQ2").text();
  questionQ3   = $("#questionQ3").text();
  questionQ4   = $("#questionQ4").text();
  questionQ5   = $("#questionQ5").text();
  answerQ1     = $("input[name='answerQ1']:checked");
  answerQ2     = $("input[name='answerQ2']:checked");
  answerQ3     = $("input[name='answerQ3']:checked");
  answerQ4     = $("input[name='answerQ4']:checked");
  answerQ5     = $("input[name='answerQ5']:checked");
  // If form valid => send data and open chart result
  var formError = validateForm();

  if( !_.isEmpty(formError.msg)){
    alert( formError.msg );
  }else{

    var dataOBJ = createFile(),
        dataChart = createData();

    var redirectURL = '/saveData.php';

    // Prevent the same persone to answer twice
    localStorage.setItem("hasSent", true);
    // Store the data to be used n results page
    localStorage.setItem("answers", JSON.stringify(dataChart));

    $.ajax({
      type: 'POST',
      url: redirectURL, //url of file's receiver on server
      dataType: "json",
      data: { data : JSON.stringify(dataOBJ) }, //your data
      success: function(){
        window.location.replace("/benchmark.html");
        // console.log('success data = ', data);
      }
    });
    // similar behavior as an HTTP redirect
    // window.location.replace("/benchmark.html");
    // similar behavior as clicking on a link
    // window.location.href = "http://stackoverflow.com";
  }
});

// Utilis
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

function validateForm(){
  var fieldError = {};
      fieldError.msg      = '';
      fieldError.name     = false;
      fieldError.company  = false;
      fieldError.email    = false;
      fieldError.subject  = false;
      fieldError.answerQ1 = false;
      fieldError.answerQ2 = false;
      fieldError.answerQ3 = false;
      fieldError.answerQ4 = false;
      fieldError.answerQ5 = false;

  if ( _.isEmpty( name ) ){
    fieldError.name = true;
    fieldError.msg += "Enter a name\n";
  }else{
    fieldError.name = false;
  }
  if( _.isEmpty( company ) ){
    fieldError.company = true;
    fieldError.msg += "Enter a company\n";
  }else{
    fieldError.company = false;
  }
  if ( _.isEmpty( email ) || !validateEmail( email ) ){
    fieldError.email = true;
    fieldError.msg += "Enter a valid email\n";
  }else{
    fieldError.email = false;
  }
  if( parseInt( subjectVal ) === 0 ){
    fieldError.subject = true;
    fieldError.msg += "Select a sector\n";
  }else{
    fieldError.subject = false;
  }
  if( _.isEmpty( $(answerQ1).data("content") ) ){
    fieldError.answerQ1 = true;
    fieldError.msg += "Answer the question 1\n";
  }else{
    fieldError.answerQ1 = false;
  }
  if( _.isEmpty( $(answerQ2).data("content") ) ){
    fieldError.answerQ2 = true;
    fieldError.msg += "Answer the question 2\n";
  }else{
    fieldError.answerQ2 = false;
  }
  if( _.isEmpty( $(answerQ3).data("content") ) ){
    fieldError.answerQ3 = true;
    fieldError.msg += "Answer the question 3\n";
  }else{
    fieldError.answerQ3 = false;
  }
  if( _.isEmpty( $(answerQ4).data("content") ) ){
    fieldError.answerQ4 = true;
    fieldError.msg += "Answer the question 4\n";
  }else{
    fieldError.answerQ4 = false;
  }
  if( _.isEmpty( $(answerQ5).data("content") ) ){
    fieldError.answerQ5 = true;
    fieldError.msg += "Answer the question 5\n";
  }else{
    fieldError.answerQ5 = false;
  }

  return fieldError;
};

function createFile(){
  // Store Questions , question selected, answers
  var allAnswers = [ $(answerQ1).data("content"), $(answerQ2).data("content"), $(answerQ3).data("content"), $(answerQ4).data("content"), $(answerQ5).data("content") ],
      allQuestions = [ questionQ1, questionQ2, questionQ3, questionQ4, questionQ5 ];

  // Create the file to be sent
  var file = [];

  for( var i = 0; i < 5; i++){
    var fileTmp = {};
    fileTmp.question = allQuestions[i];
    fileTmp.answer = allAnswers[i];

    // Add them to main file
    file.push( fileTmp );
  }

  file.push({ userName : name});
  file.push({ userCompany : company});
  file.push({ userEmail : email});
  file.push({ userSubject : subject});

  console.log( "file = ", file);

  return file;
};

function createData(){
  // Need sector
  // subjectVal;
  // Need each answers ID
  var allAnswersId = [ $(answerQ1).val(), $(answerQ2).val(), $(answerQ3).val(), $(answerQ4).val(), $(answerQ5).val() ];
  var allAnswers = [ $(answerQ1).data("content"), $(answerQ2).data("content"), $(answerQ3).data("content"), $(answerQ4).data("content"), $(answerQ5).data("content") ];
  var dataChart = {}
      dataChart.answers = [];
  _.each( allAnswers, function( answer){
    dataChart.answers.push({ "answer" : answer });
  });
  dataChart.sectorId = subjectVal;

  return dataChart;
};

function init(){

  if( localStorage.getItem("hasSent") && localStorage.getItem("answers").length ){
    window.location.replace("/benchmark.html");
  }
};

init();