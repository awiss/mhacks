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
      scrollbar: {
        enabled: true
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
        formatter: function(){
          if(this.points[0].series.name.indexOf('avg')>-1){
            var theDate =new Date(this.points[0].x);
            var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
            var str = monthNames[theDate.getMonth()] + " " + theDate.getFullYear() +'<table>';
            for (var i=0;i<this.points.length;i++){
              str += '<tr><td><span style="color: '+this.points[i].series.color+'">'+this.points[i].series.name+'</span></td></tr>'; 
              str+= '<tr><td><span style="color: '+this.points[i].series.color+'">Weighted Sentiment:</span> <b>'+ Math.round(this.points[i].y*10000)/10000+'</b></td></tr>'
            }         
            return str + '</table>'
          } else {
            return new Date(this.points[0].x).toDateString() +'<table>' +'<tr><td>Article Title:</td></tr>' +
                  '<td style="text-align: left"><b>'+this.points[0].point.articleTitle+'</b></td>' +
                      '<tr><td><span style="color: '+this.points[0].series.color+'">Weighted Sentiment:</span> <b>'+ Math.round(this.points[0].y*10000)/10000+'</b></td>' +
                    '</tr>' + '</table>'
          }
        },
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
      series: seriesArr
  });
});