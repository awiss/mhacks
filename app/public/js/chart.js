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
      plotOptions: {
      	series: {
      		cursor: 'pointer',
      		point: {
      			events: {
      				click: function() {
      					console.log(this);
      				},
      				mouseOver: function() {

      				}
      			}
      		}
      	}
      },
      tooltip: {
      	shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><table>',
        pointFormat: '<tr><td>Article Title:</td></tr>' +
        							'<tr><td style="color: {series.color}">Weighted Relevance: </td>' +
        						'<td style="text-align: right"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 4
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