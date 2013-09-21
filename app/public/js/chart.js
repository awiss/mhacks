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
          name: 'Jane',
          data: [1, 0, 4]
      }, {
          name: 'John',
          data: [5, 7, 3]
      }, {
          name: 'Dong',
          data: [2, 5, 3]
      }]
  });
});