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

  // log('script running');

  // Get the anchor tag for every book on this search results page.
  // This URL drills down into the book details.
  var books = $('p.title.product-field a');

  books.each((_i, e) => visitBook(e));

  function visitBook(bookElem) {
    // Retrieve the page contents
    var detailUrl = $(bookElem).attr('href');
    $.get(detailUrl, function(pageContents) {
      // Search it for indications it has DRM
      if (! /DRM-Free/.test(pageContents)) {
        $(bookElem)
          .css("color", "red")
          .css("text-decoration", "line-through");
        $(bookElem).parent().append("<span> has DRM!</span>");
      }
    });
  }

  // Convenience function. Shorter to call and can be filtered in the console easily.
  function log(msg) { console.log('debug: ' + msg); }

})();