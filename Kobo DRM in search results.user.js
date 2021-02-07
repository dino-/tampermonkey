// ==UserScript==
// @name         Kobo DRM in search results
// @namespace    http://ui3.info/d/
// @version      1.1
// @description  Mark up Kobo book search results with DRM status
// @author       Dino Morelli <dino@ui3.info>
// @match        https://www.kobo.com/us/en/search?query=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function() {
  'use strict';

  var $ = window.jQuery; // Avoid noisy warnings in Tampermonkey's editor

  // The values are unused, could be helpful for debugging
  const drmStatus = {
    NO: "does not have DRM",
    YES: "has DRM",
    UNKNOWN: "DRM status unknown"
  }

  // Get the anchor tag for every book on this search results page.
  // This URL drills down into the book details.
  var books = $('p.title.product-field a');

  books.each((_i, e) => visitBook(e));

  function visitBook(bookElem) {
    // Color the book gray before the (possibly lenghty) check
    $(bookElem).css("color", "gray");

    // Retrieve the page contents
    var detailUrl = $(bookElem).attr('href');
    $.get(detailUrl, function(pageContents) {
      switch (checkForDRM(pageContents)) {
        case drmStatus.NO:
          $(bookElem).css("color", "black");
          break;
        case drmStatus.YES:
          $(bookElem)
            .css("color", "red")
            .css("text-decoration", "line-through");
          $(bookElem).parent().append("<span> (has DRM!)</span>");
          break;
        case drmStatus.UNKNOWN:
        default:
          $(bookElem).css("color", "orange")
          $(bookElem).parent().append("<span> (DRM status unknown)</span>");
      }
    });
  }

  // Returns what we can determine about the DRM. Yes, no or unknown using the above "enum"
  function checkForDRM(pageContents) {
    if (/DRM-Free/.test(pageContents)) { return drmStatus.NO; }
    else if (/sold without Digital Rights Management Software/.test(pageContents)) { return drmStatus.NO; }
    else if (/Adobe DRM/.test(pageContents)) { return drmStatus.YES; }
    else { return drmStatus.UNKNOWN; }
  }

  // Convenience function. Shorter to call and can be filtered in the console easily.
  function log(msg) { console.log('debug: ' + msg); }

})();
