var curIsotopeFilter = '*';
var curIsotopePage = '';
var ppp = 11; /*Set number of items in portfolio*/

jQuery(document).ready(function() {

	// NiceScroll
	var nicesx = $("#boxscroll").niceScroll();

	// bixslider
	$('.bxslider').bxSlider({
		mode: 'horizontal',
		auto: true,
		controls: true,
		pager: false
	});

	// Pretty photo
	jQuery("a[rel^='prettyPhoto']").click(function(e) {
		if (jQuery(window).width()<480)	{
			e.stopImmediatePropagation();
			window.location = jQuery(this).attr('href');
		}
		e.preventDefault();
		return false;
	});

	jQuery("a[rel^='prettyPhoto']").prettyPhoto({
		markup: '<div class="pp_pic_holder"> \
			<div class="ppt"></div> \
			<div class="pp_content_container"> \
				<div class="pp_left"> \
				<div class="pp_right"> \
					<div class="pp_content"> \
						<div class="pp_loaderIcon"></div> \
						<div class="pp_fade"> \
							<div class="pp_nav"> \
								<a href="#" class="pp_arrow_previous"><span></span></a> \
								<a href="#" class="pp_arrow_next"><span></span></a> \
							</div> \
							<div id="pp_full_res"></div> \
							<div class="pp_details"> \
								<p class="pp_description"></p> \
								<a class="pp_close" href="#"><span></span></a> \
								<a href="#" class="pp_expand" title="Expand the image"><span></span></a> \
							</div> \
						</div> \
					</div> \
				</div> \
				</div> \
			</div> \
		</div> \
		<div class="pp_overlay"></div>',
		social_tools: '',
		theme: 'light_rounded',
		deeplinking: false,
		horizontal_padding: 0,
		overlay_gallery: false
	});

	// Tabs
	jQuery('#nav_tabs').tabs('#tab_section > .tab_content', {
		tabs: 'section > .section_header > .section_title',
			effect : 'slide',
			slideUpSpeed: 600,
			slideDownSpeed: 1000,
			initialIndex: 0,
			onClick: function (e, tabIndex) {
				var tabs = jQuery('#nav_tabs > li > a');
				var tab = tabs.eq(tabIndex);
				if(tab.attr('href') === '#portfolio') {
					if(tab.attr('href') === '#portfolio' && jQuery('.portfolio_items').length > 0) {
						jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
					}
				}
				if(tab.attr('href') === '#contacts') {
					function hider_over() {
						jQuery('.map_wrap .map_overlay').fadeOut();
					}
					setTimeout(hider_over, 1000);
					if (window.googlemap_refresh) {googlemap_refresh();}
						googlemap_refreshed = true;					
				}
				if(tab.attr('href') === '#profile') {
					skills_anim();
				}
			}
	});

	if(jQuery('.portfolio_wrapper').length > 0) {
		jQuery('.portfolio_items')
			.isotope({ 
				itemSelector: '.portfolio_post',
				layoutMode : 'masonry',
				animationOptions: {
					duration: 750,
					easing: 'linear',
					queue: false,
				},
			});
		jQuery('#portfolio_iso_filters li a').click(function(){
			var selector = jQuery(this).attr('data-filter');
			curIsotopeFilter = selector;
			jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
			jQuery(this).parents('#portfolio_iso_filters').find('a').removeClass('current');
			jQuery(this).addClass('current');
			return false;
		});
		jQuery('#portfolio_load_more').on('click', 'a', function(){
			if(!jQuery(this).hasClass('no_results')) {
				var selector = '.portfolio_items article.hidden'+(curIsotopeFilter!='*' ? curIsotopeFilter : '');
				jQuery(selector).each(function(idx) {
					if (idx<ppp) {
						jQuery(this).addClass('visible').removeClass('hidden');
					}
				});
				jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
		
				if(jQuery('.portfolio_items article.visible').length === jQuery('.portfolio_items article').length) {
					jQuery('#more_results').addClass('no_results');
				}
			}	
			return false;
		});
	}	

});

function getIsotopeFilter() {
	var flt = curIsotopeFilter!='*' ? curIsotopeFilter : '';
	flt += curIsotopePage!='' ? ((flt!='' ? '' : '') + curIsotopePage) : '';
	flt=='' ? '*' : '';
	return flt;
}
function pagesClear() {
	jQuery('.portfolio_items article').removeClass('visible').removeClass('hidden');
	jQuery("#portfolio_load_more").hide();
	curIsotopePage = '';
}
function pagesBuild() {
	var selector = '.portfolio_items article'+(curIsotopeFilter!='*' ? curIsotopeFilter : '');
	var items = jQuery(selector);
	var total = items.length;
	jQuery("#portfolio_load_more").hide();
	if (total > ppp) {
		var pagesList = '<a href="#" data-filter=".visible" id="more_results"><span>More Results</span></a>';
		items.each(function(idx, obj) {
			var pg = Math.floor(idx/ppp)+1;
			jQuery(obj).addClass(pg==1 ? 'visible' : 'hidden');
		});
		jQuery("#portfolio_load_more").show();
		jQuery("#portfolio_load_more").html(pagesList);
		curIsotopePage = '.visible';
	}
}
function skills_anim(){
	if(!jQuery('#page').hasClass('print')) {
		if(jQuery('#resume .widgets_section.section-header:visible').length > 0) {
			var wnd = jQuery(window).scrollTop()+jQuery(window).height();
			var oft = jQuery('#resume:visible .widgets_section.section-header').offset().top+
						jQuery('.widgets_section.section-header').height()+200;
			if(jQuery(window).scrollTop == ''){
				wnd = 800;
			}	
		}	
	}	
	else {
		return false;
	}
}


	jQuery(window).load(function(){
	pagesBuild();
	if(jQuery('.portfolio_items').length) {
		jQuery('.portfolio_items').isotope({ filter: getIsotopeFilter() });
		jQuery('.portfolio_items').css('height', 'auto').find('article').css('transform' ,'none');
	}

	//twitter
	$('.tweet').twittie({
		dateFormat: '%B %d, %Y',
		template: '<div class="date">{{date}}</div> {{tweet}}',
		count: 3,
		hideReplies: false
	});
	setInterval(function () {
		var item = $('.tweet ul').find('li:first');
		item.animate({
			'opacity': '0'
			}, 1000, function () {
			$(this).detach().appendTo('.tweet ul').removeAttr('style');
		});
	}, 12000);

	// Contact
$('form').submit(function(e){
	var thisForm = $(this);
        e.preventDefault();
        $(this).fadeOut(function(){
          $("#loading").fadeIn(function(){
            $.ajax({
              type: 'POST',
              url: thisForm.attr("action"),
              data: thisForm.serialize(),
              success: function(data){
                $("#loading").fadeOut(function(){
                  $("#success").text(data).fadeIn();
                });
              }
            });
          });
	});
});

});