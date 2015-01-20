// Reference the chart for latter re-use,
// Update, init...
var gaugeChart = AmCharts.makeChart("chartdiv",{
    "type":"gauge",
    "pathToImages":"http://cdn.amcharts.com/lib/3/images/",
    "faceBorderWidth":0,
    "backgroundAlpha":0,
    "color":"#FFFFFF",
    "height": 276,
    "arrows":[
      {
         "alpha":0,
         "borderAlpha":0
      }
    ],
    "axes":[
      {
         "axisThickness":0,
         "startAngle":-90,
         "endAngle":90,
         "startValue":0, // 0%
         "endValue":100, // 100%
         "id":"GaugeAxis2014",
         "tickThickness":0,
         "labelFrequency":0
      }
    ],
    "allLabels":[
      {
         "bold":true,
         "color":"#3D9CDC",
         "id":"Label2014",
         "text":"2014 results - all sectors",
         "size":18,
         "x": 112,
         "y": 200
      }
    ]
  }
);


var list = false, // Determine if data.json has been loaded
    qData,  // Store the data.json
    selectedQuestion,
    color2014 = ["#52ACE1","#99C9E6","#3B7BA1","#76CCFF","#3F85AE","#244B61","#78B8D1"],
    answerTotal2014 = 0,
    // Variable to manage the bands created on change
    bandTmp2014 = [], bandToAdd2014 = [];

if( !list ) getData();

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

// Store in different lists
  /*
  * Use of _ against the data obj received
  * to populate any lists
  *
  */
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
   * resetData
   *
   * @description: rset my variables to default
   */
  function resetData(){
    bandToAdd2014 = [];
    bandTmp2014 = [];
    answerTotal2014 = 0;
  };


// Filters / Graph settings

  /*
   * createAxis
   * @retun: GaugeAxis from Amcharts
   *
   * @band: Array of GaugeBand from Amchart
   * @description: create the axis to add to the graph
   */
  function createAxis( band ){
    var axis = new AmCharts.GaugeAxis();
        axis.startValue = 0;
        axis.endValue = 100;
        axis.startAngle = -90;
        axis.endAngle = 90;
        axis.valueInterval=10;
        axis.tickThickness=0;
        axis.labelFrequency=0;
        axis.bands = band;

        return axis
  };
// Bind onChange event to filters

// ================
// Tab Explore
// ================


   // Question selection
   // Will trigger a change of numberOfAnswer,
   // hence numberOfBands and colors...


  /*
   * exploreQuestionChange
   * @retun:
   *
   * @qId : integer
   * @description: select the question, reset the variable,
   * create the axis to add to the graph. update the chart
   */
  function exploreQuestionChange( qId ){
    selectedQuestion = _.find( qData.questions, function(q){
      return parseInt(qId) === parseInt(q.questionId);
    });

    // Reset variable
    resetData();

    findBand( selectedQuestion );

    var axis2014 = createAxis( bandToAdd2014 );
        axis2014.id="GaugeAxis2014";

    gaugeChart.addAxis(axis2014);
    gaugeChart.validateNow();

    return selectedQuestion;
  };

  /*
   * findBand
   * @retun:
   *
   * @question : object
   * @description: Get the data from the question which will be used for the amChartBand
   */
  function findBand( question ){

    _.each( question.answers, function(answer){
      bandTmp2014.push( { val: answer.answerTotal2014, text: answer.answerText} );
      answerTotal2014 += parseInt(answer.answerTotal2014) || 0;
    });

    // Once band20XX are created,
    // Generate the "bands" property for the graph
    bandToAdd2014 = generateBand( bandTmp2014, color2014 );
    return;
  }

  /*
   * generateBand
   * @retun: array of object
   *
   * @band : array
   * @color: reference to array of color
   * @description: generate amChart bands object  to add to the graph
   */
  function generateBand(band, arrayColor){

    var bandItem = [], bandLength = band.length;
    // Some of the values for band rely on which year
    // like radius and inner radius...
    var answerTotal, bandRadius, bandInnerRadius,
        bandStartValue = 0, bandEndValue;

      bandRadius = "100%";
      bandInnerRadius = "70%";
      answerTotal = parseInt(answerTotal2014);

    // create the GaugeBand properties from JSON data
    _.each( band , function( b, index ){
      var obj = {};
      bandEndValue = ( parseInt(b.val) / answerTotal ) * 100 ;
      obj.id = "band_"+index;
      obj.balloonText = b.text + " " + bandEndValue.toFixed(0) + "%";
      obj.color = arrayColor[index];
      obj.startValue = bandStartValue;
      obj.endValue = bandStartValue + bandEndValue;
      obj.radius = bandRadius;
      obj.innerRadius = bandInnerRadius;

      bandStartValue = obj.endValue;
      bandItem.push( obj );
    });

    return bandItem;
  }

  /*
  * Sector selection
  * Will trigger a change of HighestScoreResults,
  * and display the associated answer
  *
  */

  /*
   * exploreSectorChange
  * @retun:
  *
  * @sId : integer
  * @description: select the sector, reset the variable,
  * update the text
  */
  function exploreSectorChange( sId ){
    // Need to have a question selected beforehand
    var thisQID = $("#questionExplore option:selected").val(),
        maxAnswer, answerTotal = 0, indexMaxAnswer,
        allAnswersForThisSector = [], highestSector, indexSector;
    var response = {};

    if( parseInt(thisQID) === 0 ){
      alert("You have to pick a question first");
    }else{

      // Select the highest value in all sectors for this question
      // where answerTotal2014 is max => % of answer
      _.each( selectedQuestion.answers, function( answer ){
        answerTotal += parseInt(answer.answerTotal2014);
      });
      maxAnswer = _.max( selectedQuestion.answers, function( answer, index ){
        return answer.answerTotal2014;
      });
      indexMaxAnswer = _.indexOf( selectedQuestion.answers, maxAnswer );
      response.value2014 = (parseInt(maxAnswer.answerTotal2014) / parseInt(answerTotal) * 100).toFixed(0);
      response.text2014 = selectedQuestion.answers[indexMaxAnswer].answerText;

      // Select the highest value in this sectors for this question
      if( parseInt(sId) !== 0 ){
        _.each( selectedQuestion.answers, function(answer){

          var sectorSelected = _.find( answer.sectors, function(sector){
            return parseInt(sector.sectorId) === parseInt(sId);
          });

          allAnswersForThisSector.push(sectorSelected);
        });
        highestSector = _.max( allAnswersForThisSector, function( sector ){
          return sector.sectorTotal2014;
        });
        // Find Answer ID corresponding to this highest value
        // to write text
        indexSectorAnswer = _.indexOf( allAnswersForThisSector, highestSector );

        var numberOfAnswers = parseInt(selectedQuestion.answers[indexSectorAnswer].answerTotal2014);
        var numberOfAnswersInThisSector = parseInt( selectedQuestion.answers[indexSectorAnswer].sectors[ parseInt(sId) - 1 ].sectorTotal2014) ;

        response.valueSector = ( (numberOfAnswersInThisSector * 100) / numberOfAnswers ).toFixed(0);
        response.textSector = selectedQuestion.answers[indexSectorAnswer].answerText;
      }else{
        // same as answerTotal2014 is max
        response.valueSector = response.value2014
        response.textSector = response.text2014;
      }
      return response;
    }
  };


// Store the DOM elements needed
  var heading2014 = $('.data2014 h4'),
      value2014 = $('.data2014 p'),
      heading2013 = $('.data2013 h4'),
      value2013 = $('.data2013 p'),
      questionPanel = $("#questionPanel p:first-child"),
      questionE = $('#questionExplore'),
      sectorE = $('#sector');

  function init(){
    exploreQuestionChange( 1 );
    rep = exploreSectorChange( 0 );
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
      .html(rep.valueSector + "%")
      .fadeIn();
    value2013
      .hide()
      .html(rep.textSector)
      .fadeIn();
  };

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

  // IE10 fixes conditional comment
  function getInternetExplorerVersion(){
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer')    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    } else if (navigator.appName == 'Netscape'){
      var ua = navigator.userAgent;
      var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  }
  var r = getInternetExplorerVersion();

  var ua = window.navigator.userAgent;
  var isChromeOnWindows = (ua.indexOf("Chrome") > -1) && (ua.indexOf("Windows") > -1);
  if( isChromeOnWindows ){
    $(".selector select").css("color", "#999");
  }
  if( r >= 10 ){
    applyCSS();
  }

  function applyCSS(){
    $(".selector").css("margin-right", "0.5em");
    $(".selector:after").css("display", "none");
    $(".selector:after").css("top", "74px");
    $(".chartStyle").css("margin-top", "0");
    $(".chartWrapper").css("overflow", "visible");
    $(".exploreData").css("overflow", "visible");
    $(".dataPlaceholder").css("overflow", "visible");

    $("select option").css( "color" , "#343434");

    $(".select:after").css( "content", " ");
  }

