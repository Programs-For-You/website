// © 2026 Brady Krupa and Arjun Bhanderi. All rights reserved.
// The "I Agree" screen: everyone must accept the Terms of Service before using programsforyou.com.
// The Terms, Privacy Policy, and Founders' Agreement pages can be read first (they show an "I Agree" bar instead).
(function () {
  var html = document.documentElement;
  var gated = !html.hasAttribute('data-no-gate');

  function remember() {
    try {
      localStorage.setItem('pfy-tos', window.PFY_TOS);
      localStorage.setItem('pfy-tos-accepted-at', new Date().toISOString());
    } catch (e) { /* storage blocked: they'll be asked again next time */ }
  }

  // While the screen is up, the page behind it can't be clicked or reached with the keyboard.
  function lockPage(on) {
    document.querySelectorAll('body > *:not(.tos-gate)').forEach(function (el) {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function accept() {
    remember();
    html.classList.remove('tos-unaccepted');
    lockPage(false);
    var back = null;
    try { back = sessionStorage.getItem('pfy-tos-return'); sessionStorage.removeItem('pfy-tos-return'); } catch (e) {}
    // Accepted on the Terms page after clicking "Terms of Service" on another page? Go back there.
    if (!gated && back && back.indexOf(location.origin + '/') === 0 && back !== location.href) location.href = back;
  }

  document.querySelectorAll('.tos-card, .tos-bar').forEach(function (box) {
    var check = box.querySelector('[data-tos-check]');
    var agree = box.querySelector('[data-tos-accept]');
    var msg = box.querySelector('[data-tos-msg]');
    check.addEventListener('change', function () {
      agree.disabled = !check.checked;
      if (msg) msg.textContent = '';
    });
    agree.addEventListener('click', function () { if (check.checked) accept(); });
    var no = box.querySelector('[data-tos-decline]');
    if (no) no.addEventListener('click', function () {
      check.checked = false;
      agree.disabled = true;
      msg.textContent = 'You need to accept the Terms of Service to use programsforyou.com. You can still read the Terms and Privacy Policy.';
    });
  });

  document.querySelectorAll('[data-tos-read]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('pfy-tos-return', location.href); } catch (e) {}
    });
  });

  if (gated && html.classList.contains('tos-unaccepted')) {
    lockPage(true);
    var first = document.querySelector('.tos-card [data-tos-check]');
    if (first) first.focus({ preventScroll: true });
  }
})();
