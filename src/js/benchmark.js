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
    questionList,
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
  init();
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

  var params = {}, params1 = {}, params2 = {};
  var questionData = _.each( qData.questions, function( q ){
                      return parseInt(q.questionId) === parseInt( qId );
                    });
  var answerList = questionData[( parseInt( qId ) - 1)].answers;
  var answerTotalBase = 0, answersectorTotalBase = 0;

  _.each( answerList, function( answer ){

    if( parseInt(answer.sectors.sectorId) === parseInt(sId)) answersectorTotalBase += parseInt(answer.sectorTotal2014);
    answerTotalBase += parseInt(answer.answerTotal2014);
    // Total answers from this sector in this question
    _.each( answer.sectors, function( sectorAnswer ){
      if( parseInt(sectorAnswer.sectorId) === parseInt(sId)){
          answersectorTotalBase += parseInt(sectorAnswer.sectorTotal2014);
        }
      return;
    });

    return
  });

  var chartProvider = _.each( answerList, function( answer ){
                  answer.answerText = answer.answerText.substr(0, 30) + "...";
                  answer.answerSector = parseInt(answer.sectors[ sId - 1 ].sectorTotal2014 * 100 / answersectorTotalBase ).toFixed(0);
                  answer.answerTotal2014 =  parseInt(answer.answerTotal2014 * 100 / answerTotalBase).toFixed(0);

                  return
                });

  switch( qId ){
    case 1:
      params = {
                "type": "serial",
                "categoryField": "answerText",
                "rotate": true,
                "startDuration": 1,
                "categoryAxis": {
                  "autoWrap":true,
                  "gridAlpha": 0,
                  "position":"left",
                  "axisColor":"#FFFFFF",
                  "color": "#FFFFFF"
                },
                "graphs": [
                  {
                    "balloonText": "[[answerTotal2014]]%",
                    "fillAlphas": 0.8,
                    "id": "total-graph1",
                    "title": "FTSE 350 2014 All",
                    "lineColor":"#3F85AE",
                    "fillColors":"#3F85AE",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerTotal2014"
                  },
                  {
                    "balloonText": "[[answerSector]]%",
                    "fillAlphas": 0.8,
                    "id": "sector-graph1",
                    "title": "FTSE 350 2014 Your sector",
                    "lineColor":"#BF3503",
                    "fillColors":"#BF3503",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerSector"
                  }
                ],
                "valueAxes": [
                  {
                    "axisAlpha": 1,
                    "axisColor":"#FFFFFF",
                    "color": "#FFFFFF",
                    "maximum": 100
                  }
                ],
                "legend": {
                  "useGraphSettings": true,
                  "color": "#ffffff"
                },
                "guides":[{
                  "fillColor":"#FFFFFF"
                }],
                "dataProvider": chartProvider
              };
              chartDivId = "graphQ1";
    break;
    case 2:
      params = {
                "type": "serial",
                "categoryField": "answerText",
                "rotate": false,
                "startDuration": 1,
                "categoryAxis": {
                  "autoWrap":true,
                  "gridAlpha": 0,
                  "position":"left",
                  "axisColor":"#FFFFFF",
                  "color": "#FFFFFF",
                  "autoRotateAngle": 60,
                  "autoRotateCount": 1
                },
                "graphs": [
                  {
                    "balloonText": "[[answerTotal2014]]%",
                    "fillAlphas": 0.8,
                    "id": "total-graph1",
                    "title": "FTSE 350 2014 All",
                    "lineColor":"#3F85AE",
                    "fillColors":"#3F85AE",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerTotal2014"
                  },
                  {
                    "balloonText": "[[answerSector]]%",
                    "fillAlphas": 0.8,
                    "id": "sector-graph1",
                    "title": "FTSE 350 2014 Your sector",
                    "lineColor":"#BF3503",
                    "fillColors":"#BF3503",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerSector"
                  }
                ],
                "valueAxes": [
                  {
                    "axisAlpha": 1,
                    "axisColor":"#FFFFFF",
                    "color": "#FFFFFF",
                    "maximum": 100
                  }
                ],
                "legend": {
                  "useGraphSettings": true,
                  "color": "#ffffff"
                },
                "guides":[{
                  "fillColor":"#FFFFFF"
                }],
                "dataProvider": chartProvider
              };
              chartDivId = "graphQ2";
    break;
    case 3:
      params = {
                "type": "serial",
                "categoryField": "answerText",
                "rotate": false,
                "startDuration": 1,
                "categoryAxis": {
                  "autoWrap":true,
                  "gridAlpha": 0,
                  "position":"left",
                  "axisColor":"#FFFFFF",
                  "color": "#FFFFFF",
                  "autoRotateAngle": 60,
                  "autoRotateCount": 1
                },
                "graphs": [
                  {
                    "balloonText": "[[answerTotal2014]]%",
                    "fillAlphas": 0.8,
                    "id": "total-graph1",
                    "title": "FTSE 350 2014 All",
                    "lineColor":"#3F85AE",
                    "fillColors":"#3F85AE",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerTotal2014"
                  },
                  {
                    "balloonText": "[[answerSector]]%",
                    "fillAlphas": 0.8,
                    "id": "sector-graph1",
                    "title": "FTSE 350 2014 Your sector",
                    "lineColor":"#BF3503",
                    "fillColors":"#BF3503",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerSector"
                  }
                ],
                "valueAxes": [
                  {
                    "axisAlpha": 1,
                    "axisColor":"#FFFFFF",
                    "color": "#FFFFFF",
                    "maximum": 100
                  }
                ],
                "legend": {
                  "useGraphSettings": true,
                  "color": "#ffffff"
                },
                "guides":[{
                  "fillColor":"#FFFFFF"
                }],
                "dataProvider": chartProvider
              };
              chartDivId = "graphQ3";
    break;
    case 4:
      params = {
                "type": "serial",
                "categoryField": "answerText",
                "rotate": true,
                "startDuration": 1,
                "categoryAxis": {
                  "autoWrap":true,
                  "gridAlpha": 0,
                  "position":"left",
                  "axisColor":"#FFFFFF",
                  "color": "#FFFFFF"
                },
                "graphs": [
                  {
                    "balloonText": "[[answerTotal2014]]%",
                    "fillAlphas": 0.8,
                    "id": "total-graph1",
                    "title": "FTSE 350 2014 All",
                    "lineColor":"#3F85AE",
                    "fillColors":"#3F85AE",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerTotal2014"
                  },
                  {
                    "balloonText": "[[answerSector]]%",
                    "fillAlphas": 0.8,
                    "id": "sector-graph1",
                    "title": "FTSE 350 2014 Your sector",
                    "lineColor":"#BF3503",
                    "fillColors":"#BF3503",
                    "lineAlpha": 0.2,
                    "type": "column",
                    "valueField": "answerSector"
                  }
                ],
                "valueAxes": [
                  {
                    "axisAlpha": 1,
                    "axisColor":"#FFFFFF",
                    "color": "#FFFFFF",
                    "maximum": 100
                  }
                ],
                "legend": {
                  "useGraphSettings": true,
                  "color": "#ffffff"
                },
                "guides":[{
                  "fillColor":"#FFFFFF"
                }],
                "dataProvider": chartProvider
              };
              chartDivId = "graphQ4";
    break;
    case 5:
      params1 = {
                "type": "pie",
                "categoryField": "answerText",
                "id": "total-graph5-b",
                "titleField": "answerText",
                "valueField": "answerTotal2014",
                "radius": "42%",
                "innerRadius": "60%",
                "labelText": "",
                "labelRadius": "10",
                "baseColor":"#3F85AE",
                "brightnessStep": "15",
                "color": "#FFFFFF",
                "borderAlpha": 0,
                "allLabels" : [
                    {"x": 100, "y": 380, "text": "FTSE 350 2014 All", "align": "left", "size": 16, "color": "#FFFFFF"}
                    ],
                "dataProvider": chartProvider
              };
      chartDivId1 = "graphQ5b";
      params2 = {
                "type": "pie",
                "categoryField": "answerText",
                "id": "total-graph5-a",
                "titleField": "answerText",
                "valueField": "answerSector",
                "radius": "42%",
                "innerRadius": "60%",
                "labelText": "",
                "labelRadius": "10",
                "baseColor":"#BF3503",
                "brightnessStep": "15",
                "color": "#FFFFFF",
                "borderAlpha": 0,
                "allLabels" : [
                    {"x": 100, "y": 380, "text": "FTSE 350 2014 Your Sector", "align": "left", "size": 16, "color": "#FFFFFF"}
                    ],
                "dataProvider": chartProvider
              };
      chartDivId2 = "graphQ5a";
    break;
  }

  if( parseInt(qId) === 5  ){
    AmCharts.makeChart(chartDivId1, params1);
    AmCharts.makeChart(chartDivId2, params2);
  }else{
    AmCharts.makeChart(chartDivId, params);
  }

};

// Print button
$(".printpdf").on('click', function(){
  window.print();
});

getData();
