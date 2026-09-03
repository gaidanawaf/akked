/**
 * Akked Public Landing Page Component
 * Clean, human-designed bilingual presentation with seamless explainer video integration,
 * core value proposition, and direct accessible CTAs.
 */

window.AkkedLanding = {
  render() {
    const isAr = I18N.currentLang === 'ar';

    return `
      <div class="landing-page-view animate-fade-in">
        
        <!-- Public Navigation Bar for Landing Page -->
        <header class="landing-nav-header">
          <div class="landing-nav-container">
            <div class="landing-brand-area" onclick="AkkedApp.navigate('landing')">
              <picture style="display: inline-flex; line-height: 0;">
                <source srcset="assets/akkid-logo.webp" type="image/webp">
                <img src="assets/akkid-logo.png" alt="أكّد" class="landing-nav-logo" width="38" height="52" style="width: 38px; height: auto; object-fit: contain;">
              </picture>
              <div class="landing-brand-text">
                <span class="landing-brand-name">${I18N.t('brandName')}</span>
                <span class="landing-brand-tagline">${I18N.t('brandTagline')}</span>
              </div>
            </div>

            <nav class="landing-nav-links">
              <a href="#landing-top" class="landing-nav-link" onclick="event.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'});">
                ${isAr ? 'الصفحة الرئيسية' : 'Home'}
              </a>
              <a href="#verify" class="landing-nav-link" onclick="event.preventDefault(); AkkedApp.navigate('verify');">
                ${I18N.t('navVerifyPortal')}
              </a>
            </nav>

            <div class="landing-nav-actions">
              <!-- Language Switcher -->
              <button class="header-btn" onclick="AkkedApp.toggleLanguage()" title="${isAr ? 'English' : 'العربية'}" aria-label="${isAr ? 'English' : 'العربية'}">
                <svg class="akked-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>${isAr ? 'English' : 'العربية'}</span>
              </button>

              <!-- Theme Switcher -->
              <button class="header-btn header-btn-icon" onclick="AkkedApp.toggleTheme()" title="${I18N.t('switchTheme')}" aria-label="${I18N.t('switchTheme')}">
                <svg class="akked-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
              </button>

              <!-- Primary Launch CTA Button -->
              <button class="btn btn-primary landing-nav-cta" onclick="AkkedApp.navigate('dashboard')">
                <span>${isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
                ${AkkedIcons.get(isAr ? 'arrow-left' : 'arrow-right', { size: 15 })}
              </button>
            </div>
          </div>
        </header>

        <!-- Hero Section with Centered Brand Logo & Value Proposition -->
        <section class="landing-hero-section" id="landing-top">
          <div class="landing-hero-container">
            
            <!-- Centered Akked Brand Identity -->
            <div class="landing-hero-brand-center">
              <picture class="landing-hero-logo-wrap">
                <source srcset="assets/akkid-logo.webp" type="image/webp">
                <img src="assets/akkid-logo.png" 
                     alt="منصة أكّد" 
                     title="منصة أكّد" 
                     class="landing-hero-logo-img"
                     width="130" 
                     height="178">
              </picture>
            </div>

            <!-- Strong Headline -->
            <h1 class="landing-hero-title">
              ${I18N.t('landingHeadline')}
            </h1>

            <!-- Primary CTAs -->
            <div class="landing-hero-cta-group">
              <button class="btn btn-primary landing-btn-hero-primary" onclick="AkkedApp.navigate('dashboard')">
                <picture style="display: inline-flex; line-height: 0;">
                  <source srcset="assets/proof-doc-mint.webp" type="image/webp">
                  <img src="assets/proof-doc-mint.png" alt="" width="20" height="20" style="width: 20px; height: 20px; object-fit: contain;">
                </picture>
                <span>${I18N.t('landingBtnLaunch')}</span>
                ${AkkedIcons.get(isAr ? 'arrow-left' : 'arrow-right', { size: 18 })}
              </button>

              <button class="btn btn-secondary landing-btn-hero-secondary" onclick="AkkedApp.navigate('verify')">
                ${AkkedIcons.get('shield-check', { size: 19 })}
                <span>${I18N.t('landingBtnVerify')}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Seamless Integrated Explainer Video Section -->
        <section class="landing-section landing-video-section">
          <div class="landing-section-header" style="margin-bottom: 24px;">
            <h2 class="landing-section-title">${isAr ? 'شارك المطلوب فقط، واحفظ بياناتك الأخرى' : 'Share Only What’s Needed, Protect the Rest'}</h2>
          </div>

          <div class="landing-video-clean-wrapper">
            <div class="video-clean-media-container">
              <video 
                id="akked-main-explainer-video" 
                class="video-clean-element"
                controls
                preload="metadata"
                poster="assets/video-poster.webp"
                playsinline
                aria-label="${isAr ? 'فيديو منصة أكد' : 'Akked Video'}">
                <source src="assets/Act_like_a_senior_Arabic_video.mp4" type="video/mp4">
                <source src="Act_like_a_senior_Arabic_video.mp4" type="video/mp4">
                <track src="assets/captions_ar.vtt" kind="captions" srclang="ar" label="العربية" default>
                <p style="padding: 24px; text-align: center; color: var(--text-muted);">
                  ${isAr ? 'متصفحك لا يدعم تشغيل الفيديو المباشر.' : 'Your browser does not support HTML5 video.'}
                </p>
              </video>
            </div>
          </div>
        </section>

        <!-- Final Direct CTA Banner -->
        <section class="landing-cta-banner-section">
          <div class="landing-cta-banner-card">
            <h2 class="landing-cta-heading">${I18N.t('landingCtaTitle')}</h2>
            <p class="landing-cta-desc">${I18N.t('landingCtaDesc')}</p>
            
            <div class="landing-cta-buttons">
              <button class="btn btn-primary btn-lg" onclick="AkkedApp.navigate('dashboard')">
                <span>${I18N.t('landingBtnLaunch')}</span>
                ${AkkedIcons.get(isAr ? 'arrow-left' : 'arrow-right', { size: 18 })}
              </button>
              <button class="btn btn-secondary btn-lg" onclick="AkkedApp.navigate('verify')">
                ${AkkedIcons.get('shield-check', { size: 18 })}
                <span>${I18N.t('landingBtnVerify')}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Public Landing Footer -->
        <footer class="landing-footer">
          <div class="landing-footer-container">
            <div class="landing-footer-left">
              <picture style="line-height: 0;">
                <source srcset="assets/akkid-logo.webp" type="image/webp">
                <img src="assets/akkid-logo.png" alt="أكّد" width="30" height="42" style="width: 30px; height: auto; object-fit: contain;">
              </picture>
              <div>
                <span style="font-weight: 800; color: var(--brand-primary); font-size: 1.05rem;">${I18N.t('brandName')}</span>
                <span style="color: var(--text-muted); font-size: 0.85rem; margin-inline-start: 8px;">— ${I18N.t('landingFooterTagline')}</span>
              </div>
            </div>

            <div class="landing-footer-center">
              <span>${I18N.t('landingFooterRights')}</span>
            </div>

            <div class="landing-footer-right">
              <button class="btn btn-secondary btn-sm" onclick="AkkedApp.toggleLanguage()">
                ${AkkedIcons.get('globe', { size: 14 })}
                <span>${isAr ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        </footer>

      </div>
    `;
  }
};
