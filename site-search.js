/* CIPA — shared site search + site chrome.
 * Included by every content page. Auto-wires:
 *   - form[data-global-search]  -> autocomplete + submit to search.html?q=
 *   - body[data-results-page]   -> renders ranked results on search.html
 *   - [data-menu-btn]/[data-menu], [data-to-top], .onpage-link, a[href^="#"]
 */
(function () {
  'use strict';

  /* ================= Search index =================
   * type: service | form | fee | guide
   * url: internal page, anchor or forms-library deep link.
   */
  var INDEX = [
    // ---- Service overviews (one page per user task) ----
    { type: 'service', title: 'Register a private company: requirements and constitution',
      summary: 'What to prepare before registering a private company: compulsory constitution template, beneficial ownership details, P500 fee and the OBRS filing steps — all on the service hub.',
      url: 'home.html#how-to-comply', keywords: ['private', 'company', 'register', 'registration', 'requirements', 'prepare', 'constitution'] },
    { type: 'service', title: 'Register a business name: requirements and fee',
      summary: 'How to register a business name, what to prepare, the registration fee and how to file through OBRS.',
      url: 'business-name.html', keywords: ['business', 'name', 'register', 'registration', 'fee', 'cost', 'price'] },
    { type: 'service', title: 'Protect a business logo (trademark registration)',
      summary: 'A logo is protected by registering a trademark. Plain-language guide to what a trademark covers and the next step to apply.',
      url: 'trademark.html', keywords: ['logo', 'trademark', 'brand', 'protect', 'protection', 'intellectual', 'property', 'mark'] },
    { type: 'service', title: 'File online through OBRS',
      summary: 'Submit constitutions, registrations and returns through the Online Business Registration System. Login, create a profile or search the register.',
      url: 'home.html#obrs', keywords: ['obrs', 'online', 'file', 'filing', 'submit', 'portal', 'login', 'register'] },
    { type: 'service', title: 'Declare beneficial ownership',
      summary: 'Every company must declare the natural persons with ultimate control, plus the nature of their interest, per the FIA Act.',
      url: 'home.html#overview', keywords: ['beneficial', 'owner', 'ownership', 'controllers', 'control', 'fia'] },

    // ---- Guides & info pages ----
    { type: 'guide', title: 'CIPA service hub (home)',
      summary: 'Starting point for compulsory constitutions, beneficial ownership, quick-access services and OBRS filing before 30 September 2026.',
      url: 'home.html', keywords: ['home', 'start', 'hub', 'overview', 'cipa'] },
    { type: 'guide', title: 'Forms and downloads library',
      summary: 'All 16 downloadable forms in one place: 4 constitution templates, 5 beneficial-owner forms, 5 restoration forms and 2 annual returns.',
      url: 'forms.html', keywords: ['forms', 'downloads', 'documents', 'templates', 'library', 'all'] },
    { type: 'guide', title: 'What is AML/CFT (CIPA)',
      summary: 'Mechanisms describing legal persons in Botswana and how basic and beneficial ownership information is obtained and recorded.',
      url: 'https://www.cipa.co.bw/what-is-aml-cft', keywords: ['aml', 'cft', 'mechanisms', 'legal', 'persons'] },

    // ---- Fees ----
    { type: 'fee', title: 'Constitution submission fee: P500 (all company types)',
      summary: 'The submission fee for constitutions is P500 for every company type, filed before 30 September 2026.',
      url: 'home.html#fees', keywords: ['fee', 'cost', 'price', 'p500', '500', 'constitution', 'pay', 'payment'] },
    { type: 'fee', title: 'Business name registration fee',
      summary: 'Payable on submission via OBRS. See the business name guide for details.',
      url: 'business-name.html#fees', keywords: ['fee', 'cost', 'price', 'business', 'name', 'pay', 'payment', 'much'] },
    { type: 'fee', title: 'Annual return fees: P150 (close) / P300 (public or private)',
      summary: 'Yearly statutory declaration of shareholding, directors and status.',
      url: 'forms.html?cat=annual#annual-return-forms', keywords: ['fee', 'cost', 'annual', 'return', 'p150', 'p300', 'yearly'] },
    { type: 'fee', title: 'Beneficial ownership declaration: free',
      summary: 'Declaring beneficial owners carries no separate filing fee.',
      url: 'home.html#overview', keywords: ['fee', 'cost', 'free', 'beneficial', 'bo'] },

    // ---- Constitution templates ----
    { type: 'form', title: 'Constitution template: private company limited by shares',
      summary: 'For companies owned by shareholders with no public share offering. PDF, 240 KB.',
      url: 'forms.html?cat=constitution#constitution-templates', keywords: ['constitution', 'template', 'private', 'shares', 'download'] },
    { type: 'form', title: 'Constitution template: public company limited by shares',
      summary: 'For entities raising capital publicly with freely transferable shares. PDF, 280 KB.',
      url: 'forms.html?cat=constitution#constitution-templates', keywords: ['constitution', 'template', 'public', 'shares', 'download'] },
    { type: 'form', title: 'Constitution template: close company',
      summary: 'For small enterprises with simplified governance and up to 5 members. PDF, 210 KB.',
      url: 'forms.html?cat=constitution#constitution-templates', keywords: ['constitution', 'template', 'close', 'small', 'download'] },
    { type: 'form', title: 'Constitution template: company limited by guarantee',
      summary: 'For non-profits, associations and clubs where members provide a financial guarantee. PDF, 225 KB.',
      url: 'forms.html?cat=constitution#constitution-templates', keywords: ['constitution', 'template', 'guarantee', 'non-profit', 'association', 'club', 'download'] },

    // ---- Beneficial owner & governance ----
    { type: 'form', title: 'Company secretaries submission of details form',
      summary: 'Required notification of appointed secretary credentials. PDF, 185 KB.',
      url: 'forms.html?cat=beneficial#beneficial-owner-forms', keywords: ['secretary', 'secretaries', 'governance', 'download'] },
    { type: 'form', title: 'Controllers form',
      summary: 'Mandatory identification of natural persons exercising direct or indirect control. PDF, 195 KB.',
      url: 'forms.html?cat=beneficial#beneficial-owner-forms', keywords: ['controllers', 'control', 'beneficial', 'download'] },
    { type: 'form', title: 'Nominator consent form',
      summary: 'Formal authorization and declaration from nominating parties. PDF, 160 KB.',
      url: 'forms.html?cat=beneficial#beneficial-owner-forms', keywords: ['nominator', 'consent', 'nominee', 'download'] },
    { type: 'form', title: 'Beneficial owner consent: proposed company',
      summary: 'Verified consent declaration for new company registration. PDF, 210 KB.',
      url: 'forms.html?cat=beneficial#beneficial-owner-forms', keywords: ['beneficial', 'consent', 'proposed', 'new', 'download'] },
    { type: 'form', title: 'Beneficial owner consent: existing company',
      summary: 'Compliance update for already incorporated entities. PDF, 205 KB.',
      url: 'forms.html?cat=beneficial#beneficial-owner-forms', keywords: ['beneficial', 'consent', 'existing', 'download'] },

    // ---- Restoration ----
    { type: 'form', title: 'Restoration form: business names (failure to re-register)',
      summary: 'Supplementary form reinstating a business name after failure to re-register. PDF, 175 KB.',
      url: 'forms.html?cat=restoration#restoration-forms', keywords: ['restoration', 're-register', 'business', 'names', 'reinstate', 'download'] },
    { type: 'form', title: 'Restoration form: private or public companies',
      summary: 'Supplementary reinstatement form for private or public companies. PDF, 210 KB.',
      url: 'forms.html?cat=restoration#restoration-forms', keywords: ['restoration', 're-register', 'private', 'public', 'reinstate', 'download'] },
    { type: 'form', title: 'Restoration form: close companies',
      summary: 'Supplementary reinstatement form for close companies. PDF, 190 KB.',
      url: 'forms.html?cat=restoration#restoration-forms', keywords: ['restoration', 're-register', 'close', 'reinstate', 'download'] },
    { type: 'form', title: 'Restoration form: companies limited by guarantee',
      summary: 'Supplementary reinstatement form for guarantee companies. PDF, 185 KB.',
      url: 'forms.html?cat=restoration#restoration-forms', keywords: ['restoration', 're-register', 'guarantee', 'reinstate', 'download'] },
    { type: 'form', title: 'Restoration form: external companies',
      summary: 'Supplementary reinstatement form for external companies. PDF, 205 KB.',
      url: 'forms.html?cat=restoration#restoration-forms', keywords: ['restoration', 're-register', 'external', 'foreign', 'reinstate', 'download'] },

    // ---- Annual returns ----
    { type: 'form', title: 'Annual return: public or private company',
      summary: 'Statutory yearly declaration of shareholding, directors and status. PDF, 310 KB.',
      url: 'forms.html?cat=annual#annual-return-forms', keywords: ['annual', 'return', 'public', 'private', 'yearly', 'download'] },
    { type: 'form', title: 'Annual return: close company',
      summary: 'Streamlined annual filing for registered close companies. PDF, 260 KB.',
      url: 'forms.html?cat=annual#annual-return-forms', keywords: ['annual', 'return', 'close', 'yearly', 'download'] }
  ];

  var TYPE_LABEL = { service: 'Service', form: 'Form', fee: 'Fee', guide: 'Guide' };
  var TYPE_BADGE = {
    service: 'bg-sky-100 text-sky-800 border-sky-200',
    form: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    fee: 'bg-amber-100 text-amber-800 border-amber-200',
    guide: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  var STOPWORDS = { no: 1, or: 1, of: 1, to: 1, in: 1, on: 1, for: 1, is: 1, it: 1,
    as: 1, at: 1, by: 1, an: 1, be: 1, do: 1, how: 1, what: 1, the: 1, and: 1, a: 1 };

  function words(q) {
    return (q || '').toLowerCase().split(/[^a-z0-9]+/).filter(function (w) {
      return w.length > 1 && !STOPWORDS[w];
    });
  }

  function esc(w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function hasWord(text, w) { return new RegExp('\\b' + esc(w) + '\\b').test(text); }

  function score(entry, ws, phrase) {
    var t = ' ' + entry.title.toLowerCase() + ' ';
    var k = ' ' + entry.keywords.join(' ').toLowerCase() + ' ';
    var d = ' ' + entry.summary.toLowerCase() + ' ';
    var s = 0;
    ws.forEach(function (w) {
      if (hasWord(t, w)) s += 5;
      else if (hasWord(k, w)) s += 3;
      else if (hasWord(d, w)) s += 1;
    });
    if (phrase && t.toLowerCase().indexOf(phrase) !== -1) s += 4;
    return s;
  }

  function search(q, type) {
    var ws = words(q);
    if (!ws.length) return [];
    var phrase = ws.join(' ');
    return INDEX
      .map(function (e) { return { e: e, s: score(e, ws, phrase) }; })
      .filter(function (r) { return r.s > 0 && (!type || type === 'all' || r.e.type === type); })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (r) { return r.e; });
  }

  /* ================= Autocomplete (F6) ================= */
  function attachAutocomplete(form) {
    var input = form.querySelector('input[name="q"]');
    if (!input) return;
    form.style.position = 'relative';
    var box = document.createElement('div');
    box.className = 'hidden absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl z-50 overflow-hidden text-left';
    box.setAttribute('role', 'listbox');
    form.appendChild(box);
    var active = -1, current = [];

    function close() { box.classList.add('hidden'); box.innerHTML = ''; active = -1; current = []; }
    function open(list) {
      current = list; active = -1;
      if (!list.length) { close(); return; }
      box.innerHTML = '';
      list.forEach(function (entry, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'option');
        b.className = 'w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0';
        b.innerHTML = '<span class="min-w-0"><span class="block text-sm font-semibold text-slate-900 truncate"></span>' +
          '<span class="block text-xs text-slate-500 truncate"></span></span>' +
          '<span class="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ' + TYPE_BADGE[entry.type] + '">' + TYPE_LABEL[entry.type] + '</span>';
        b.querySelector('span span').textContent = entry.title;
        b.querySelectorAll('span span')[1].textContent = entry.summary;
        b.addEventListener('mousedown', function (ev) {
          ev.preventDefault();
          window.location.href = entry.url;
        });
        b.addEventListener('mouseenter', function () { paint(i); });
        box.appendChild(b);
      });
      box.classList.remove('hidden');
    }
    function paint(i) {
      active = i;
      Array.prototype.forEach.call(box.children, function (child, j) {
        child.classList.toggle('bg-slate-100', j === i);
      });
    }
    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (q.length < 2) { close(); return; }
      open(search(q, null).slice(0, 6));
    });
    input.addEventListener('keydown', function (e) {
      if (box.classList.contains('hidden')) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); paint((active + 1) % current.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paint((active - 1 + current.length) % current.length); }
      else if (e.key === 'Enter' && active >= 0 && current[active]) {
        e.preventDefault();
        window.location.href = current[active].url;
      }
      else if (e.key === 'Escape') { close(); }
    });
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) close();
    });
    input.addEventListener('blur', function () { setTimeout(close, 150); });
  }

  /* ================= Results page (F3, F4, F5, F7) ================= */
  function renderResults() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim();
    var type = params.get('type') || 'all';
    var list = document.getElementById('results-list');
    var count = document.getElementById('results-count');
    var empty = document.getElementById('no-results');
    var heading = document.getElementById('results-heading');
    var input = document.getElementById('results-input');
    if (input && q) input.value = q;
    document.querySelectorAll('.type-chip').forEach(function (chip) {
      var on = chip.getAttribute('data-type') === type;
      chip.setAttribute('aria-pressed', String(on));
      chip.classList.toggle('bg-[#0266b3]', on);
      chip.classList.toggle('text-white', on);
      chip.classList.toggle('bg-slate-100', !on);
      chip.classList.toggle('text-slate-600', !on);
      chip.addEventListener('click', function () {
        params.set('type', chip.getAttribute('data-type'));
        if (q) params.set('q', q);
        window.location.search = params.toString();
      });
    });
    if (!q) {
      heading.textContent = 'Search CIPA services, forms and fees';
      count.textContent = 'Type above to search across services, forms, fees and guides.';
      list.innerHTML = '';
      empty.classList.add('hidden');
      document.getElementById('popular-panel').classList.remove('hidden');
      return;
    }
    var results = search(q, type);
    heading.textContent = 'Results for "' + q + '"';
    document.getElementById('popular-panel').classList.add('hidden');
    if (!results.length) {
      list.innerHTML = '';
      count.textContent = 'No results found.';
      empty.classList.remove('hidden');
      document.getElementById('no-results-query').textContent = q;
      return;
    }
    empty.classList.add('hidden');
    count.textContent = results.length + (results.length === 1 ? ' result' : ' results') + ' found';
    list.innerHTML = '';
    results.forEach(function (entry) {
      var a = document.createElement('a');
      a.href = entry.url;
      a.className = 'block bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:border-[#0266b3] hover:shadow transition';
      a.innerHTML = '<span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-2 ' + TYPE_BADGE[entry.type] + '">' + TYPE_LABEL[entry.type] + '</span>' +
        '<span class="block text-base font-bold text-slate-900"></span>' +
        '<span class="block text-sm text-slate-600 mt-1"></span>';
      a.querySelectorAll('span')[1].textContent = entry.title;
      a.querySelectorAll('span')[2].textContent = entry.summary;
      list.appendChild(a);
    });
  }

  /* ================= Site chrome ================= */
  function initChrome() {
    document.querySelectorAll('[data-menu-btn]').forEach(function (btn) {
      var menu = btn.parentElement.querySelector('[data-menu]') ||
                 document.getElementById(btn.getAttribute('aria-controls') || '');
      btn.addEventListener('click', function () {
        if (!menu) return;
        var open = menu.classList.toggle('hidden');
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
    var toTop = document.querySelector('[data-to-top]');
    var header = document.querySelector('[data-site-header]');
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('shadow-md', y > 8);
      if (toTop) {
        var show = y > 600;
        toTop.classList.toggle('hidden', !show);
        toTop.classList.toggle('flex', show);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          try { history.replaceState(null, '', '#' + id); } catch (err) {}
        }
      });
    });
    var links = Array.prototype.slice.call(document.querySelectorAll('.onpage-link'));
    var targets = links.map(function (l) { return document.getElementById(l.getAttribute('data-target')); }).filter(Boolean);
    var ACTIVE = ['text-[#0266b3]', 'font-semibold', 'border-[#0266b3]'];
    var IDLE = ['text-slate-600', 'border-transparent'];
    function setActive(id) {
      links.forEach(function (l) {
        var on = l.getAttribute('data-target') === id;
        ACTIVE.forEach(function (c) { l.classList.toggle(c, on); });
        IDLE.forEach(function (c) { l.classList.toggle(c, !on); });
      });
    }
    if ('IntersectionObserver' in window && targets.length) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
      targets.forEach(function (t) { obs.observe(t); });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-global-search]').forEach(function (form) {
      attachAutocomplete(form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var q = input ? input.value.trim() : '';
        window.location.href = 'search.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
      });
    });
    if (document.body.getAttribute('data-results-page') !== null) renderResults();
    initChrome();
  });
})();
