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
      					$.ajax({url:"http://localhost:3000/body/"+this.mongoId,success:function(res){
                  overlay();
                }});
      				},
      			}
      		}
      	}
      },
      tooltip: {
      	shared: true,
        useHTML: true,
        headerFormat: '{point.key}<table>',
        pointFormat: '<tr><td>Article Title:</td></tr>' +
                  '<td style="text-align: left"><b>{point.articleTitle}</b></td>' +
        							'<tr><td><span style="color: {series.color}">Weighted Sentiment:</span> <b>{point.y}</b></td>' +
        						'</tr>',
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