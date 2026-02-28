// ── Mission signals — injected by signals.js ──────────────────
(function(){
  // Wrap LocalStorage writes from appstore/playground to emit signals
  const _setItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key, value) {
    _setItem(key, value);
    // Detect app creation (appstore.js saves 'cp_apps')
    if(key === 'cp_apps') {
      _setItem('cp_last_app_created', Date.now());
    }
  };
})();
