// Get data from previous page
// and reference the user-answrs placeholder
var userAnswers = JSON.parse( localStorage.getItem("answers") ),
    answers = $(".user-answer");

// Replace the content with the answers
_.each( userAnswers.answers, function( content, index ){
  $(answers[index]).find('span').text(content.answer);
});

// Create Graphs!!!
var list = false, // Determine if data.json has been loaded
    qData,  // Store the data.json
    selectedQuestion,
    color2014 = ["#52ACE1","#99C9E6","#3B7BA1","#76CCFF","#3F85AE","#244B61","#78B8D1"],
    answerTotal2014 = 0;



function getData(){
  var URL = "data/data.json";

  var jqxhr = $.ajax({
      url:URL,
      dataType: "json"
    })
    .done(function(e) {
      createLists(e);
      list = true;
    })
    .fail(function(e) {
      list = false;
    })
    .always(function(e) {
      console.log( "getData called and e = ", e );
      console.log( "list = ", list );
    });

    return list
};

function init(){
  // Get json
  if( !list ) getData();

  // Create
  var sId = parseInt( userAnswers.sectorId );
  for( var i = 1; i < 6; i++){
    // Generate all 5 graphs
    createGraph( i , sId );
  }

};

/*
 * createLists
 * @retun:
 *
 * @data
 * Generate the different lists
 * Store the received data from Ajax
 * Usefull when HTML depend on these data
 */
function createLists(data){
  qData = data;

  questionList = _.each( data, function(question){
    var obj = {
      id : question.questionID,
      text: question.questionText
    }
    return obj
  });

  return;
}

/*
 * createGraph
 * @retun:
 *
 * @param1 : integer
 * @param2 : integer
 * Generate the graph for question param1 and with sector param2
 */
function createGraph( qId, sId){
  // var chart = AmCharts.makeChart("ChartDivsIDs", {param bellow})
  // Need ChartDivsIDs

  // from qId 1 to 4
    // "type": "serial",
    // need to set up rotate ( false = vertical bar, true = horizontal bar )
    // categoryField "answerText"
    // need to generate dataProvider:[
    // {
    //   answerText: "",
    //   sectorValue: "%",
    //   answerTotalValue: "%"
    // }]
    // need to create "graphs": [
    //   {
    //     "balloonText": "[[value]]",
    //     "fillAlphas": 0.8,
    //     "id": "Sector",
    //     "lineAlpha": 0.2,
    //     "title": "sector Title",
    //     "type": "column",
    //     "valueField": "sectorValue"
    //   },
    //   {
    //     "balloonText": "answerTotalValue:[[value]]",
    //     "fillAlphas": 0.8,
    //     "id": "Global",
    //     "lineAlpha": 0.2,
    //     "title": "answer Total title",
    //     "type": "column",
    //     "valueField": "answerTotalValue"
    //   }
    // ],


  // pie chart
    // Global
    // "type": "pie",
    // "theme": "none",
    // "dataProvider": [
    //   {
    //     "title": AnswerText,
    //     "value": answerTotal2014
    //   },
    //  .
    //  .
    //  .
    // ],
    // "titleField": "answerText",
    // "valueField": "answerTotal2014",
    // "labelRadius": 5,
    // "radius": "42%",
    // "innerRadius": "60%",
    // "labelText": "[[title]]"

    // Sector
    // "type": "pie",
    // "theme": "none",
    // "dataProvider": [
    //   {
    //     "title": answerText,
    //     "value": sectorTotal2014
    //   },
    //  .
    //  .
    //  .
    // ],
    // "titleField": "answerText",
    // "valueField": "sectorTotal2014",
    // "labelRadius": 5,
    // "radius": "42%",
    // "innerRadius": "60%",
    // "labelText": "[[title]]"
};