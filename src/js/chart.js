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
var axisStore=[];


// Need to get my JSON file for data if no lists
var list = false, qData,
    color2013 = ["#F0B7AB","#E89281","#E16F59","#DD4815","#C34328","#AB3B23"],
    color2014 = ["#B5D8EF","#91C4E7","#6EB2DF","#3D9CDC","#3F8DC1","#387EAC"],
    answerTotal2013 = 0, answerTotal2014 = 0,
    bandTmp2013 = [], bandTmp2014 = [],
    bandToAdd2013 = [], bandToAdd2014 = [];

if( !list ) getData();

function getData(){
  var jqxhr = $.ajax({
      url:"../data/data.json",
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

    // answersQ1
    return;
  }

// Filters / Graph settings

// Bind onChange event to filters

// Tab Explore

  /*
  * Question selection
  * Will trigger a change of numberOfAnswer,
  * hence numberOfBands and colors
  *
  */
  function exploreQuestionChange( qId ){
    var selectedQuestion = _.find( qData.questions, function(q){
      return parseInt(qId) === parseInt(q.questionId);
    });

    // Reset variable
    bandToAdd2013 = [];
    bandToAdd2014 = [];
    bandTmp2013 = [];
    bandTmp2014 = [];
    answerTotal2013 = 0;
    answerTotal2014 = 0;

    findBand( selectedQuestion );

    var axis2013 = new AmCharts.GaugeAxis();
        axis2013.id= "GaugeAxis2013";
        axis2013.startValue = 0;
        axis2013.endValue = 100;
        axis2013.startAngle = -90;
        axis2013.endAngle = 90;
        axis2013.valueInterval=10;
        axis2013.tickThickness=0;
        axis2013.labelFrequency=0;
        axis2013.bands = bandToAdd2013;
        console.log( "axis2013.band = ", axis2013.bands )

    var axis2014 = new AmCharts.GaugeAxis();
        axis2014.startValue = -90;
        axis2014.endValue = 100;
        axis2014.startAngle = -90;
        axis2014.endAngle = 90;
        axis2014.id="GaugeAxis2014";
        axis2014.valueInterval=10;
        axis2014.tickThickness=0;
        axis2014.labelFrequency=0;
        // axis2014.bands = bandToAdd2014;
        // console.log( "axis2014.band = ", axis2014.bands )


    axisStore.push(axis2013);
    gaugeChart.addAxis(axis2013);
    // gaugeChart.addAxis(axis2014);
    // axisStore.push(axis2014);
    gaugeChart.validateNow();

  };

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
    // bandToAdd2014 = generateBand( bandTmp2014, color2014 );
  }

  /*
   * generateBand
   * @retun:
   *
   * @band : array
   * @color: reference to array of color
   * @description
   */
  function generateBand(band, arrayColor){

    var bandItem = [], bandLength = band.length;
    // Some of the values for band rely on which year
    // like radius and inner radius...
    var answerTotal, bandRadius, bandInnerRadius,
        bandStartValue = 0, bandEndValue;

    if( arrayColor === color2014 ){
      console.log( "arrayColor === color2014 " )
      bandRadius = "100%";
      bandInnerRadius = "80%";
      answerTotal = parseInt(answerTotal2014);
    }else{
      console.log( "arrayColor === color2013 " )
      bandRadius = "55%";
      bandInnerRadius = "75%";
      answerTotal = parseInt(answerTotal2013);
    }

    _.each( band , function( b, index ){
      console.log("answerTotal = ", answerTotal);
      var obj = {};
      bandEndValue = ( parseInt(b.val) / answerTotal ) * 100 ;
      obj.id = "band_"+index;
      obj.balloonText = b.text;
      obj.color = arrayColor[index + 1];
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

// Tab Benchmark

  /*
  * Question selection
  * Will trigger a change of reference
  * to compare your answers against
  * only show highest result of this question
  *
  * Sector result from your sector selection in the form
  *
  */

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

$("#question").change(function( e ){
  var qId = $(this).val();
  exploreQuestionChange( qId );
});