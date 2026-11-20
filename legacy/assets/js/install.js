// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// The install guide's Mac / Windows switch. It opens the guide for the visitor's computer, or the one a link asks
// for (#mac, #windows, or a step inside either guide). Without JavaScript both guides show, one after the other.
// This file loads right after the two guides (not deferred), so the right one is picked before the page is drawn.
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-os-tabs] [role="tab"]'));
  if (!tabs.length) return;
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });

  function show(os, focus) {
    tabs.forEach(function (t, i) {
      var on = t.getAttribute('data-os') === os;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
      if (on && focus) t.focus();
    });
  }

  // Which guide holds the part of the page the link points to (#windows, #run-anyway, #open-anyway, ...).
  function guideFor(hash) {
    var id = decodeURIComponent((hash || '').slice(1));
    var el = id && document.getElementById(id);
    var panel = el && el.closest ? el.closest('.os-panel') : null;
    return panel ? { os: panel.id, el: el } : null;
  }

  function choose(os, focus) {
    show(os, focus);
    try { history.replaceState(null, '', '#' + os); } catch (e) { /* not allowed here: the guide still switches */ }
  }

  document.documentElement.classList.add('os-tabbed');
  var linked = guideFor(location.hash);
  show(linked ? linked.os : (/Windows/i.test(navigator.userAgent) ? 'windows' : 'mac'));

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { choose(t.getAttribute('data-os')); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      choose(next.getAttribute('data-os'), true);
    });
  });

  // A link on this page to the other guide (like "see the Windows guide") switches to it.
  window.addEventListener('hashchange', function () {
    var target = guideFor(location.hash);
    if (!target) return;
    show(target.os);
    var at = target.el.id === target.os ? document.querySelector('[data-os-tabs]') : target.el;
    at.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
})();
