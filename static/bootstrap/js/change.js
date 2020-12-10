//for changing font size
  $("#slider").slider(
{
            value:30,
            min: 0,
            max: 100,
            step: 1,
            slide: function( event, ui ) {
                $( "#slider-value" ).html( ui.value );
                var fs = $( "#slider-value" ).html();
                $("td > span").css("font-size",fs+"px");
	        }
            
}
);
// for changing color
function hexFromRGB(r, g, b) {
    var hex = [
      r.toString( 16 ),
      g.toString( 16 ),
      b.toString( 16 )
    ];
    $.each( hex, function( nr, val ) {
      if ( val.length === 1 ) {
        hex[ nr ] = "0" + val;
      }
    });
    return hex.join( "" ).toUpperCase();
  }
  function refreshSwatch() {
    var red = $( "#red" ).slider( "value" ),
      green = $( "#green" ).slider( "value" ),
      blue = $( "#blue" ).slider( "value" ),
      hex = hexFromRGB( red, green, blue );
    $( "#swatch" ).css( "background-color", "#" + hex );
    $( "td > span" ).css( "color", "#" + hex );
  }
  $(function() {
    $( "#red, #green, #blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
      slide: refreshSwatch,
      change: refreshSwatch
    });
    $( "#red" ).slider( "value", 255 );
    $( "#green" ).slider( "value", 140 );
    $( "#blue" ).slider( "value", 60 );
  });

function CreateShadow() {
var ox = document.getElementById('offsetx').value;
var oy = document.getElementById('offsety').value;
var bd = document.getElementById('blur').value;
var cl = document.getElementById('color').value;
$("td > span").css("text-shadow",ox+"px "+oy+"px "+bd+"px "+cl);
}
//for accessing final style
$( "td" ).click(function() {
var html = $(this).html();
$( "#code" ).text( html );
$('#code').show();
$('html,body').animate({scrollTop: 0});
});

