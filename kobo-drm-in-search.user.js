// ==UserScript==
// @name         kobo-drm-in-search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mark up Kobo book search results with indication of DRM
// @author       Dino Morelli <dino@ui3.info>
// @match        https://www.kobo.com/us/en/search?query=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('dino: script running');
  var books = $('p.title.product-field a');

  books.each(function(i, e) {
    var detailUrl = $(e).attr('href');
    console.log("dino: " + i + "  " + detailUrl);
    // $(e).css("color", "red");
    //console.log('dino: ' + doSomething());
    hasDRM(detailUrl);
  });
  console.log('dino: after loop');

  function hasDRM(url) {
    console.log('dino: ' + url);
    var pageContents = null;
    $.get(url, function(data) {
      console.log('dino: in the callback');
      pageContents = data;
    });
    console.log('dino: ' + pageContents);
    var metadataLines = $(pageContents).$('div.bookitem-secondary-metadata ul li').text;
    metadataLines.each(function(i, e) {
      console.log('dino: ' + i + "  " + e);
    });
    return false;  // FIXME
  }

//  function hasDRM(url) {
//    console.log('dino: ' + url);
//    var pageContents = $.get(url);
//    var metadataLines = $(pageContents).$('div.bookitem-secondary-metadata ul li').text;
//    metadataLines.each(function(i, e) {
//      console.log('dino: ' + i + "  " + e);
//    });
//    return false;  // FIXME
//  }

  // var hrefs = new Array();
  // var elements = $('.headline > a');
  // elements.each(function() {
  //     hrefs.push($(this).addr('href'));
  // });

  // $('body').append('<input type="button" value="Open Links" id="CP">')
  // $("#CP").css("position", "fixed").css("top", 0).css("left", 0);
  // $('#CP').click(function() {
  //     $.each(hrefs, function (index, value) {
  //         setTimeout(function(){
  //             window.open(value, '_blank');
  //         },1000);
  //     });
  // });
})();