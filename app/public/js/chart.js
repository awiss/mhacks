$(document).ready(function(){

	function overlay() {
		$('#overlay').fadeIn();
		document.getElementById('overlayModal').scrollTop = 0;
	  $('#overlay').show();
	}

	$('#overlay').on('click', function(){
		$('#overlay').fadeOut();
		$('#overalyText').empty();
	});
  var exp;
  if(make){
    exp = {
      buttons: {
        customButton: {
                        x: -62,
                        onclick: function () {
                            var chart = $('#graphContainer').highcharts();
                            var series = chart.series;
                            var vis = false;
                            for (var j=0; j < series.length; j+=2){
                              vis = vis || series[j].visible;
                            }
                            for (var j=0; j < series.length; j+=2){
                              series[j].setVisible(!vis,false);
                            }
                            chart.redraw();
                        },
                        symbol: 'circle'
        },
        contextButton: {

        }
      }
    }
  } else {
    exp = {
      buttons: {
        contextButton: {

        }
      }
    } 
  }
  var highchartsOptions = Highcharts.setOptions(Highcharts.theme); 
  $('#graphContainer').highcharts({
      chart: {
        type: 'line',
        zoomType: 'x'
      },
      title: {
        text: titleArr.join(', ')
      },
      subtitle: {
      	text: 'Weighted Sentiment vs Date'
      },
      plotOptions: {
      	series: {
      		cursor: 'pointer',
      		point: {
      			events: {
      				click: function() {
      					var self = this;
      					$.ajax({url:"http://localhost:3000/body/"+this.mongoId+"/"+make,success:function(res){
                  overlay();
                  $('#overlayText').html('<h2>' + self.articleTitle + '</h2>' + res);
                }});
      				},
      			}
      		}
      	}
      },
      exporting: exp,
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
          }
      },
      series: seriesArr
  });
});