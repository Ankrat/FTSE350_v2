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
         "valueInterval":10, // 10% step
         "tickThickness":0,
         "labelFrequency":0,
         "bands":[
            {
               "balloonText":"label one",
               "color":"#F0B7AB",
               "startValue":0,
               "endValue":20,
               "id":"GaugeBand-1",
               "innerRadius":"75%",
               "radius":"55%"
            }
         ]
      },
      {
         "axisThickness":0,
         "startAngle":-90,
         "endAngle":90,
         "startValue":0, // 0%
         "endValue":100, // 100%
         "id":"GaugeAxis2013",
         "valueInterval":10,
         "tickThickness":0,
         "labelFrequency":0,
         "bands":[
            {
               "balloonText":"label seven",
               "color":"#B5D8EF",
               "endValue":20,
               "id":"GaugeBand-7",
               "innerRadius":"80%",
               "radius":"100%",
               "startValue":0
            }
         ]
      }
    ],
    "allLabels":[
      {
         "bold":true,
         "color":"#DD4815",
         "id":"Label2014",
         "text":"2013",
         "size":12,
         "x":84,
         "y":310
      },
      {
         "bold":true,
         "color":"#3D9CDC",
         "id":"Label2013",
         "text":"2014",
         "size":12,
         "x":28,
         "y":310
      }
    ]
  }
);

/* Could be handy ?
* gaugeChart.addInitHandler( beforeInit , ['gauge']);
* function beforeInit(){};
*
*/

// Need to get my JSON file for data
var jqxhr = $.ajax({
      url:"",
      dataType: "json"
    })
    .done(function(e) {
      console.log( "success and e = ", e );
    })
    .fail(function(e) {
      console.log( "error and e = ", e );
    })
    .always(function(e) {
      console.log( "complete and e = ", e );
    });

// Store in different lists
  /*
  * Use of _ against the data obj received
  * to populate any lists
  *
  */

// Filters / Graph settings

// Bind onChange event to filters

// Tab Explore

  /*
  * Question selection
  * Will trigger a change of numberOfAnswer,
  * hence numberOfBands and colors
  *
  */


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
