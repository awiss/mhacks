$(document).ready(function(){
  var highchartsOptions = Highcharts.setOptions(Highcharts.theme);  
  $('#graphContainer').highcharts({
      chart: {
          type: 'line',
          zoomType: 'x'
      },
      title: {
          text: 'Weighted Sentiment vs Time'
      },
      xAxis: {
          title: {
          	text: "Date"
          },
          type: "datetime"
      },
      yAxis: {
          title: {
              text: 'Weighted Sentiment'
          },
          min: -.5,
          minRange: .9
      },
      series: [{
          name: modelName,
          data: data
      }]
  });
});