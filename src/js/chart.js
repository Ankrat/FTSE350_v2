// Reference the chart for latter re-use,
// Update, init...
var gaugeChart = AmCharts.makeChart("chartdiv",{
    "type":"gauge",
    "pathToImages":"http://cdn.amcharts.com/lib/3/images/",
    "faceBorderWidth":0,
    "color":"#FFFFFF",
    "theme":"dark",
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
      },
      {
         "axisThickness":0,
         "startAngle":-90,
         "endAngle":90,
         "startValue":0, // 0%
         "endValue":100, // 100%
         "id":"GaugeAxis2013",
         "tickThickness":0,
         "labelFrequency":0
      }
    ],
    "allLabels":[
      {
         "bold":true,
         "color":"#DD4815",
         "id":"Label2013",
         "text":"2013",
         "size":14,
         "x": 178,
         "y": 310
      },
      {
         "bold":true,
         "color":"#3D9CDC",
         "id":"Label2014",
         "text":"2014",
         "size":14,
         "x": 110,
         "y": 310
      }
    ]
  }
);

gaugeChart.exportConfig = {

  menuTop: '0',
  menuLeft: 'auto',
  menuRight: '0px',
  menuBottom: 'auto',
  menuItems: [{
      textAlign: 'center',
      onclick: function () {},
      icon: 'img/export.png',
      iconTitle: 'Save chart as an image',
      items: [{
          title: 'JPG',
          format: 'jpg'
      }, {
          title: 'PNG',
          format: 'png'
      }, {
          title: 'SVG',
          format: 'svg'
      } ,{
      title: 'PDF',
      format: 'pdf'
      }]
  }],
  menuItemOutput:{
      fileName:"amChart"
  },
  menuItemStyle: {
      backgroundColor: '#FFF',
      rollOverBackgroundColor: '#EFEFEF',
      color: '#000000',
      rollOverColor: '#CC0000',
      paddingTop: '6px',
      paddingRight: '6px',
      paddingBottom: '6px',
      paddingLeft: '6px',
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      textAlign: 'left',
      textDecoration: 'none'
  }
};


var list = false, // Determine if data.json has been loaded
    qData,  // Store the data.json
    selectedQuestion,
    color2013 = ["#F0B7AB","#E89281","#E16F59","#DD4815","#C34328","#AB3B23"],
    color2014 = ["#B5D8EF","#91C4E7","#6EB2DF","#3D9CDC","#3F8DC1","#387EAC"],
    answerTotal2013 = 0, answerTotal2014 = 0,
    // Variable to manage the bands created on change
    bandTmp2013 = [], bandTmp2014 = [],
    bandToAdd2013 = [], bandToAdd2014 = [];

if( !list ) getData();

function getData(){
  if( window.location.host == "localhost:9000"){
    var URL = "../data/data.json";
  }else{
    var URL = "/kpmg/FTSE350_v2/src/data/data.json";
  }

  var jqxhr = $.ajax({
      url:URL,
      dataType: "json"
    })
    .done(function(e) {
      createLists(e);
      list = true;
      init();
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


    return;
  }

  /*
   * resetData
   *
   * @description: rset my variables to default
   */
  function resetData(){
    bandToAdd2013 = [];
    bandToAdd2014 = [];
    bandTmp2013 = [];
    bandTmp2014 = [];
    answerTotal2013 = 0;
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

    var axis2013 = createAxis( bandToAdd2013 );
        axis2013.id= "GaugeAxis2013";

    var axis2014 = createAxis( bandToAdd2014 );
        axis2014.id="GaugeAxis2014";

    gaugeChart.addAxis(axis2013);
    // gaugeChart.addAxis(axis2014);
    // axisStore.push(axis2014);
    gaugeChart.validateNow();

    return;
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
      bandTmp2013.push( { val: answer.answerTotal2013, text: answer.answerText} );
      bandTmp2014.push( { val: answer.answerTotal2014, text: answer.answerText} );
      answerTotal2013 += parseInt(answer.answerTotal2013) || 0;
      answerTotal2014 += parseInt(answer.answerTotal2014) || 0;
    });

    // Once band20XX are created,
    // Generate the "bands" property for the graph
    bandToAdd2013 = generateBand( bandTmp2013, color2013 );
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

    // Graph Properties corresponding to the year, not the data
    if( arrayColor === color2014 ){
      bandRadius = "100%";
      bandInnerRadius = "80%";
      answerTotal = parseInt(answerTotal2014);
    }else{
      bandRadius = "55%";
      bandInnerRadius = "75%";
      answerTotal = parseInt(answerTotal2013);
    }

    // create the GaugeBand properties from JSON data
    _.each( band , function( b, index ){
      var obj = {};
      bandEndValue = ( parseInt(b.val) / answerTotal ) * 100 ;
      obj.id = "band_"+index;
      obj.balloonText = b.text + " " + bandEndValue.toFixed(2) +"%";
      obj.color = arrayColor[index ];
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
    var thisQID = $("#question option:selected").val();
    if( parseInt(thisQID) === 0 ){
      alert("You have to pick a question first");
    }else{
      // Select the highest value in this sector for this question
      var highestValue2013, highestValue2014, allAnswerSector = [];

      _.each( selectedQuestion.answers, function(answer){

        var sectorSelected = _.find( answer.sectors, function(sector){
          // var thisText = answer.answerText;
          return parseInt(sector.sectorId) === parseInt(sId);
        });
        allAnswerSector.push(sectorSelected);
      });
      var index2013;
      highestValue2013 = _.max( allAnswerSector, function( sector, index ){
        return sector.sectorTotal2013;
      });
      // Find Answer ID corresponding to this highest value
      // to write text
      index2013 = _.indexOf( allAnswerSector, highestValue2013 );

      highestValue2014 = _.max( allAnswerSector, function( sector ){
        return sector.sectorTotal2014;
      });
      index2014 = _.indexOf( allAnswerSector, highestValue2014 );

      var response = {};
      response.value2013 = (parseInt(highestValue2013.sectorTotal2013) / parseInt(selectedQuestion.answers[index2013].answerTotal2013) * 100).toFixed(2);
      response.text2013 = selectedQuestion.answers[index2013].answerText;
      response.value2014 = (parseInt(highestValue2014.sectorTotal2014) / parseInt(selectedQuestion.answers[index2014].answerTotal2014) * 100).toFixed(2);
      response.text2014 = selectedQuestion.answers[index2014].answerText;

      return response;
    }
  };

// ================
// Tab Benchmark
// ================

  // Question selection
  // Will trigger a change of reference
  // to compare your answers against
  // only show highest result of this question
  //
  // Sector result from your sector selection in the form


  /*
  * Each Question answers
  * Will trigger a text update in the graph
  *
  */

  /*
  * Apply Selection
  * Fill in the form to see the updated graph
  * Send data to email...
  */


// Store the DOM elements needed
  var heading2014 = $('.data2014 h4'),
      value2014 = $('.data2014 p'),
      heading2013 = $('.data2013 h4'),
      value2013 = $('.data2013 p');

function init(){
    exploreQuestionChange( 1 );
    rep = exploreSectorChange( 1 );

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
  };