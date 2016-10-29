import $ from 'jquery';
import appStarter from './app-starter';


$(function() {
  appStarter();
});

$(document).ready(function() {


  // BEGIN: Show download menu

  var hidden = true;
  $('.download-btn').click(function(e) {
    e.preventDefault();
    if (hidden){
      $(this).next('.download-files-container').fadeToggle(200, function(){hidden = false;});
    }
  });

  $('html').click(function() {
    if (!hidden) {
      $('.download-files-container').fadeOut();
      hidden=true;
    }
  });

  $('.download-files-container').click(function(event) {
    event.stopPropagation();
  });

  // END: Show download menu

  // BEGIN: Show / hide top contact panel

  $('.main-contact-btn, .contact-btn').on('click',function(e) {
    e.preventDefault();
    $('.contact-panel').slideDown(400);
    $('.contact-panel').addClass('open');
  });

  $('.contact-panel-close').on('click', function(e){
    e.preventDefault();
    $('.contact-panel').removeClass('open');
    $('.contact-panel').slideUp(400);
  });

  // END: Show / hide top contact panel

  // BEGIN: Fancybox for portfolio
  $('.fancybox').fancybox({
    openEffect: 'none',
    closeEffect: 'none'
  });
  // END: Fancybox for portfolio

  // BEGIN: Scroll to top

  $(window).scroll(function(){
    if ($(this).scrollTop() > 200) {
      $('.to-top').fadeIn();
    } else {
      $('.to-top').fadeOut();
    }
  });
  $('.to-top a').click(function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  });

  // END: Scroll to top

});
