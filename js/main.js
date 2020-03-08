
(function($) {
	
	$('#this-year').html(new Date().getFullYear());
	
	$('.prettySocial').prettySocial();
	
	//contain position fix 
	function positionFix(){
		
		var winH = $(window).height();
		var objH = $('#main-wrapper').height();
		var pushTopH = parseInt(( winH - objH)/4 );
		if($("#modal").is(":visible")){
			$('.push-top').height(0);
		}else{
			$('.push-top').height(pushTopH);
		};
	}
	positionFix();
 	$(window).resize(positionFix);
	
	
	$('#slides').superslides({'play':false});  
 /* MODAL HANDLER  */
	$(".show-modal").on("click", function(){
		
		var modalView = $(this).attr("data-modal");
		if($("#modal").is(":visible")){
		}else{
			$("#sidebar-wrapper").removeClass("active");
			$('.push-top').slideUp('hide',function(){
				$("#modal").slideDown("slow");
				$("#modal").addClass("active");
				$("#menu-toggle").hide();
				setTimeout(function() {
					var center = map.getCenter();
					google.maps.event.trigger(map, "resize");
					map.setCenter(center); 
				}, 50);
			});
		}
	});
		
	$("#modal .bt-modal-close").on("click", function() {
		$("#modal").removeClass("active");
		$("#modal").slideUp("slow", function() {
			$('.push-top').slideDown(500);
			$("#menu-toggle").show();
			$("#menu-toggle").removeClass("bt-menu-open").addClass("bt-menu-close");
		});
	}); 
	
	/* google map */
	var map;
	function initialize() {
		var myLatlng = new google.maps.LatLng(25.0381524,121.5493331);
		var mapOptions = {
				zoom: 18,
				center:myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				streetViewControl: false,
				backgroundColor:'#000',
				styles:[{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
			};
		map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map
		});
		
	}
	google.maps.event.addDomListener(window, 'load', initialize);
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});

	$(window).load(function(){	
	/* PRELOADER */
		$('#preloader').fadeOut(500, function() {
			$('body').css('overflow', 'visible');
		
			//trigger css3 animations
			$('.animated').each(function() {
				var elem = $(this);
				var animation = elem.data('animation');
				if (!elem.hasClass('visible') && elem.attr('data-animation') !== undefined) {
					if (elem.attr('data-animation-delay') !== undefined) {
						var timeout = elem.data('animation-delay');
						setTimeout(function() {
							elem.addClass(animation + " visible");
						}, timeout);
					} else {
						elem.addClass(elem.data('animation') + " visible");
					}
				}
			});
		});
	}); //window load
}(jQuery));

