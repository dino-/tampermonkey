// ==UserScript==
// @name         Kobo DRM in search results
// @namespace    http://ui3.info/d/
// @version      1.2
// @description  Mark up Kobo book search results with DRM status
// @author       Dino Morelli <dino@ui3.info>
// @source       https://github.com/dino-/tampermonkey
// @match        https://www.kobo.com/us/en/search?query=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// ==/UserScript==

(function() {
  'use strict';

  var $ = window.jQuery; // Avoid noisy warnings in Tampermonkey's editor

  // The values are unused, could be helpful for debugging
  const DrmStatus = {
    NO: "does not have DRM",
    YES: "has DRM",
    UNKNOWN: "DRM status unknown"
  }

  // Get the anchor tag for every book on this search results page.
  // This URL drills down into the book details.
  var books = $('p.title.product-field a');

  // Evaluate all the books in parallel
  Promise.all(
    // This produces a list of Promises from the $.get async calls
    books.each((_i, bookElem) => {
      // Color the book gray before the (possibly lenghty) checks
      $(bookElem).css("color", "gray");
      $.get($(bookElem).attr('href')).then(styleBook(bookElem))
    })
  );

  function styleBook(bookElem) { return function(pageContents) {
    switch (checkForDRM(pageContents)) {
      case DrmStatus.NO:
        $(bookElem).css("color", "black");
        break;
      case DrmStatus.YES:
        $(bookElem)
          .css("color", "red")
          .css("text-decoration", "line-through");
        $(bookElem).parent().append("<span> (has DRM!)</span>");
        break;
      case DrmStatus.UNKNOWN:
      default:
        $(bookElem).css("color", "orange")
        $(bookElem).parent().append("<span> (DRM status unknown)</span>");
    }
  }}

  // Returns what we can determine about the DRM. Yes, no or unknown using the above "enum"
  function checkForDRM(pageContents) {
    if (/DRM-Free/.test(pageContents)) { return DrmStatus.NO; }
    else if (/sold without Digital Rights Management Software/.test(pageContents)) { return DrmStatus.NO; }
    else if (/Adobe DRM/.test(pageContents)) { return DrmStatus.YES; }
    else { return DrmStatus.UNKNOWN; }
  }

  // Convenience function. Shorter to call and can be filtered in the console easily.
  function log(msg) { console.log('debug: ' + msg); }

})();
