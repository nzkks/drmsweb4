import $ from 'jquery';
import appStarter from './app-starter';
import './fancybox/jquery.fancybox.js';

$(function() {
  appStarter();
});

// BEGIN: Font Awesome

(function() {
  var css = document.createElement('link');
  css.href = 'https://use.fontawesome.com/0350acee1c.css';
  css.rel = 'stylesheet';
  css.type = 'text/css';
  document.getElementsByTagName('head')[0].appendChild(css);
})();

// END: Font Awesome

// BEGIN: Google Analytics
var gaAnalytics = gaAnalytics || function(){};
gaAnalytics('create', 'UA-10657263-10', 'auto');
gaAnalytics('send', 'pageview');
(function() {
  var gaScript = document.createElement('script');
  gaScript.src = 'https://www.google-analytics.com/analytics.js';
  gaScript.async = 1;
  gaScript.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(gaScript);
})('gaAnalytics');
// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
// (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
// m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// END: Google Analytics

$(document).ready(function() {

  // BEGIN: Fall Png images to Svg images
  // if(!Modernizr.svg){var i=document.getElementsByTagName('img'),j,y;for(j=i.length;j--;){y=i[j].src;if(y.match(/svg$/)){i[j].src=y.slice(0,-3)+'png';}}}
  // END: Fall Png images to Svg images

  // BEGIN: Lazy load images

  // This line is nothing to do with lazyload.
  // By default .lazy class style set to display: none.
  // Only when JavaScript is present then we are showing the elements.
  $('.lazy').show();

  var lazy = [];
  registerListener('load', setLazy);
  registerListener('load', lazyLoad);
  registerListener('scroll', lazyLoad);
  registerListener('resize', lazyLoad);
  function setLazy(){
    lazy = document.getElementsByClassName('lazy');
  }
  function lazyLoad(){
    for(var i=0; i<lazy.length; i++){
      if(isInViewport(lazy[i])){
        if (lazy[i].getAttribute('data-src')){
          lazy[i].src = lazy[i].getAttribute('data-src');
          lazy[i].removeAttribute('data-src');
        }
      }
    }
    cleanLazy();
  }
  function cleanLazy(){
    lazy = Array.prototype.filter.call(lazy, function(l){ return l.getAttribute('data-src');});
  }
  function isInViewport(el){
    var rect = el.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  function registerListener(event, func) {
    if (window.addEventListener) {
      window.addEventListener(event, func);
    } else {
      window.attachEvent('on' + event, func);
    }
  }

  // END: Lazy load images

  // BEGIN: Local page links

  $.easing.elasout = function(x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; s=p/4; }
    else s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  };

  $.scrollTo(0); // reset the screen to (0,0)

  $('.web-gallery-btn').click(function() {
    $.scrollTo(this.hash, 1500, {offset:{top:-70}, easing:'elasout'});
    return false;
  });
  $('.print-gallery-btn').click(function() {
    $.scrollTo(this.hash, 1500, {offset:{top:-70}, easing:'elasout'});
    return false;
  });
  $('.about-page-link').click(function() {
    $.scrollTo(this.hash, 1500, {offset:{top:-80}, easing:'elasout'});
    return false;
  });

  // END: Local page links

  // BEGIN: Show download menu
  $('.download-files-container').hide();
  var hidden = true;
  $('.download-btn').hover(function(e) {
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

  // Hide Social icon names
  $('.icon-alt-name').hide();
  // Show few social icons only when javascript is enabled
  $('.behance, .pinterest, .facebook').show();
  // Hide Contact details in Bio section
  $('.bio-details .item1, .bio-details .item2').hide();
  // Show both Contact buttons only when JavaScript enabled
  $('.contact-btn').show().css('display', 'inline-block');

  // BEGIN: Show / hide top contact panel

  $('.contact-btn').on('click',function(e) {
    e.preventDefault();
    $('.contact-panel').slideDown(400).addClass('open');
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    $('#gform-name').focus();
  });

  $('.contact-panel .panel-close').on('click', function(e){
    e.preventDefault();
    $('.contact-panel').slideUp(400).removeClass('open');
  });

  // BEGIN: Show / hide footer tech panel
  $('.footer .footer-tech-btn').show();
  $('.footer .extended').hide();
  $('.footer-tech-btn').on('click',function(e) {
    $('.footer .extended').toggle();
    e.preventDefault();
  });

  // END: Show / hide footer tech panel

  // BEGIN: Skills Accordion
  $('.skills-accordion .skill-category-content').hide();
  $('.skills-accordion li h4 a').addClass('needPsuedo');
  $('.skills-accordion a').click(function(j) {
    var dropDown = $(this).closest('li').find('.skill-category-content');
    $(this).closest('.skills-accordion').find('.skill-category-content').not(dropDown).slideUp();
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
    } else {
      $(this).closest('.skills-accordion').find('a.active').removeClass('active');
      $(this).addClass('active');
    }
    dropDown.stop(false, true).slideToggle();
    j.preventDefault();
  });
  // END: Skills Accordion

  // BEGIN: Fancybox for portfolio
  $('.fancybox').fancybox({
    padding: 0,
    openEffect: 'none',
    closeEffect: 'none',
    margin: [20, 40, 20, 40]
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
  $('.to-top').click(function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  });

  // END: Scroll to top

  // BEGIN: Lazy loading the Google font for headings
  // var xhr = new XMLHttpRequest();
  // var url = 'https://fonts.googleapis.com/css?family=Teko:400';
  //
  // xhr.open('GET', url, true);
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState == 4 && xhr.status == 200) {
  //     var style = document.createElement('style');
  //     style.innerHTML = xhr.responseText;
  //     document.head.appendChild(style);
  //   }
  // };
  // xhr.send();
  // END: Lazy loading the Google font for headings

  // BEGIN: Testimonial slider
  var slickOptions = {
    prevArrow: '<span class="arrow-prev slick-arrow" title="Previous"><span class="fa fa-angle-left" aria-hidden="true"></span></span>',
    nextArrow: '<span class="arrow-next slick-arrow" title="Next"><span class="fa fa-angle-right" aria-hidden="true"></span></span>',
    dots: true,
    autoplay: true,
    autoplaySpeed: 40000,
    fade: true,
    adaptiveHeight: true,
    cssEase: 'linear',
    infinite: true
  };

  var divToSlick1 = $('.section--testimonials .items-block');
  divToSlick1.slick(slickOptions);

  var beforePrint = function() {
    divToSlick1.slick('unslick');
  };
  var afterPrint = function() {
    divToSlick1.slick(slickOptions);
  };

  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        beforePrint();
      } else {
        afterPrint();
      }
    });
  }

  window.onbeforeprint = beforePrint;
  window.onafterprint = afterPrint;

  // END: Testimonial slider

});

// BEGIN: Contact Form Script
function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
// get all data in form and return object
function getFormData() {
  var elements = document.getElementById('gform').elements; // all form elements
  var fields = Object.keys(elements).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    if(elements[k].type === 'checkbox'){
      data[k] = elements[k].checked;
    // special case for Edge's html collection
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          data[k] = elements[k].item(i).value;
        }
      }
    }
  });
  //console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var data = getFormData();         // get the values submitted in the form
  if( !validEmail(data.email) ) {   // if email is not valid show error
    //document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      //console.log( xhr.status, xhr.statusText );
      //console.log(xhr.responseText);
      document.getElementById('gform').style.display = 'none'; // hide form
      document.getElementById('thankyou_message').style.display = 'block';
      return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
    xhr.send(encoded);
  }
}
function loaded() {
  //console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener('submit', handleFormSubmit, false);
}
document.addEventListener('DOMContentLoaded', loaded, false);

// END: Contact Form Script
