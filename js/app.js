/**
 * Akked Main Application Controller
 */

window.AkkedApp = {
  currentView: 'landing',
  viewParams: {},
  mobileSidebarOpen: false,

  init() {
    // Initialize i18n
    I18N.init();

    // Initialize State
    AkkedState.init();

    // Setup Event Listeners
    document.addEventListener('languageChanged', () => {
      this.updateStaticUI();
      this.renderView();
    });

    document.addEventListener('stateChanged', () => {
      this.renderView();
      this.updateNotificationBadge();
    });

    // Check URL parameters for direct verification link or view navigation
    const urlParams = new URLSearchParams(window.location.search);
    const verifyId = urlParams.get('verify');
    const tokenParam = urlParams.get('token');
    const viewParam = urlParams.get('view');
    const hash = window.location.hash.replace('#', '');

    if (tokenParam || verifyId) {
      this.navigate('verify', { proofId: verifyId || '', token: tokenParam || '' });
    } else if (viewParam) {
      this.navigate(viewParam);
    } else if (hash && ['dashboard', 'shares', 'verify', 'entities', 'mydata', 'alerts', 'settings', 'wizard', 'landing'].includes(hash)) {
      this.navigate(hash);
    } else {
      this.navigate('landing');
    }

    const themeParam = urlParams.get('theme');
    this.applyTheme(themeParam || AkkedState.settings.theme || 'light');
    this.updateNotificationBadge();
    this.updateStaticUI();

    // Initialize Voice Assistant Engine
    if (window.AkkedVoiceAssistant) {
      AkkedVoiceAssistant.init();
    }

    // Trigger spoken announcement & voice renewal dialogue if accessibility mode is active
    if (AkkedState.settings.accessibility && AkkedState.settings.accessibility.enabled) {
      setTimeout(() => {
        if (window.AkkedVoiceAssistant) {
          AkkedVoiceAssistant.startRenewalFlow();
        }
      }, 1200);
    }
  },

  navigate(viewName, params = {}) {
    this.currentView = viewName;
    this.viewParams = params;

    // Update location hash for browser history / bookmarking
    try {
      history.replaceState(null, '', `#${viewName}`);
    } catch (e) {}

    // Update app-container layout for landing vs dashboard shell
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      if (viewName === 'landing') {
        appContainer.classList.add('landing-mode');
      } else {
        appContainer.classList.remove('landing-mode');
      }
    }

    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
      if (el.getAttribute('data-view') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    if (this.mobileSidebarOpen) {
      this.toggleMobileSidebar();
    }

    // Initialize wizard on entry
    if (viewName === 'wizard' && !params.keepState) {
      AkkedWizard.init();
    }

    this.renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderView() {
    const container = document.getElementById('view-container');
    if (!container) return;

    let content = '';
    switch (this.currentView) {
      case 'landing':
        content = AkkedLanding.render();
        break;
      case 'dashboard':
        content = AkkedDashboard.render();
        break;
      case 'shares':
        content = AkkedShares.render();
        break;
      case 'wizard':
        content = AkkedWizard.render();
        break;
      case 'verify':
        content = AkkedVerify.render(this.viewParams);
        break;
      case 'entities':
        content = AkkedEntities.render();
        break;
      case 'mydata':
        content = AkkedMyData.render();
        break;
      case 'alerts':
        content = AkkedAlerts.render();
        break;
      case 'settings':
        content = AkkedSettings.render();
        break;
      default:
        content = AkkedLanding.render();
    }

    container.innerHTML = content;
    this.updateBreadcrumbs();
  },

  updateBreadcrumbs() {
    const breadcrumb = document.getElementById('page-breadcrumb-text');
    if (!breadcrumb) return;

    const names = {
      landing: I18N.t('navLanding'),
      dashboard: I18N.t('navDashboard'),
      shares: I18N.t('navShares'),
      wizard: I18N.t('createSecureShare'),
      verify: I18N.t('navVerifyPortal'),
      entities: I18N.t('navTrustedEntities'),
      mydata: I18N.t('navMyData'),
      alerts: I18N.t('navAlerts'),
      settings: I18N.t('navSettings')
    };

    breadcrumb.textContent = names[this.currentView] || I18N.t('navDashboard');
  },

  updateStaticUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = I18N.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', I18N.t(key));
      }
    });

    const langToggleBtn = document.getElementById('lang-toggle-text');
    if (langToggleBtn) {
      const isAr = I18N.currentLang === 'ar';
      langToggleBtn.innerHTML = `
        <span class="lang-text-full">${isAr ? 'English' : 'العربية'}</span>
        <span class="lang-text-compact">${isAr ? 'EN' : 'عربي'}</span>
      `;
    }
  },

  toggleLanguage() {
    const nextLang = I18N.currentLang === 'ar' ? 'en' : 'ar';
    I18N.setLanguage(nextLang);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'light' ? 'dark' : 'light';
    this.applyTheme(nextTheme);
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AkkedState.settings.theme = theme;
    AkkedState.save();
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
      if (this.mobileSidebarOpen) {
        sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('active');
      } else {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
      }
    }
  },

  updateNotificationBadge() {
    const unread = (AkkedState.alerts || []).filter(a => !a.read).length;
    const badge = document.getElementById('header-notif-dot');
    const sideCount = document.getElementById('sidebar-alerts-count');
    
    if (badge) {
      badge.style.display = unread > 0 ? 'block' : 'none';
    }
    if (sideCount) {
      sideCount.textContent = unread;
      sideCount.style.display = unread > 0 ? 'inline-block' : 'none';
    }
  },

  // Toast System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = AkkedIcons.get('info', { size: 18 });
    if (type === 'success') iconSvg = AkkedIcons.get('check', { size: 18, strokeWidth: 2.5 });
    if (type === 'warning') iconSvg = AkkedIcons.get('alert-triangle', { size: 18 });
    if (type === 'danger') iconSvg = AkkedIcons.get('x-circle', { size: 18 });

    toast.innerHTML = `
      <span style="display: flex; align-items: center; color: var(--brand-primary);">${iconSvg}</span>
      <div style="flex: 1; font-size: 0.88rem; font-weight: 600; color: var(--text-main);">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Modal System
  openModal(htmlContent) {
    const backdrop = document.getElementById('global-modal-backdrop');
    const body = document.getElementById('global-modal-body');
    if (backdrop && body) {
      body.innerHTML = htmlContent;
      backdrop.classList.add('open');
    }
  },

  closeModal() {
    const backdrop = document.getElementById('global-modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('open');
    }
  },

  shareWebsite() {
    const isAr = I18N.currentLang === 'ar';
    const shareData = {
      title: isAr ? 'منصة أكّد' : 'Akked Platform',
      text: isAr ? 'منصة أكّد — حارس البيانات الشخصية والموافقات ومساعد الوصول الشامل الذكي.' : 'Akked — Personal Data & Consent Guardian & AI Guardian.',
      url: 'https://atheerkf22.github.io/akked/'
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.url).catch(() => {});
    }

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    }

    this.showToast(isAr ? 'تم نسخ رابط الموقع بنجاح لمشاركته مع الجميع!' : 'Website link copied to clipboard!', 'success');
  }
};

// Start application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  AkkedApp.init();
});
