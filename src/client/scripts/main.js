import $ from 'jquery';
import appStarter from './app-starter';

$(function() {
  appStarter();
});

$(document).ready(function() {
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
});
