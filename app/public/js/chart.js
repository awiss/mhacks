$(document).ready(function(){
  var highchartsOptions = Highcharts.setOptions(Highcharts.theme);  
  $('#graphContainer').highcharts({
      chart: {
          type: 'line'
      },
      title: {
          text: 'Fruit Consumption'
      },
      xAxis: {
          categories: ['Apples', 'Bananas', 'Oranges']
      },
      yAxis: {
          title: {
              text: 'Fruit eaten'
          }
      },
      series: [{
          name: modelName,
          data: values
      }]
  });
});