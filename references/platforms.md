# Platform matrix and device acceptance

Documentation checked 2026-10-11; capabilities must be refreshed against target versions. These are documented expectations, **not physical-device results**. Use MDN compatibility tables linked in sources and feature detection. Browser brand alone is insufficient; engine, OS, installation mode and permissions matter.

| Capability | iOS Safari tab / Home Screen | Android Chrome tab / installed | Fallback |
|---|---|---|---|
| Install | User-driven Add to Home Screen; no assumption of beforeinstallprompt | Browser-driven installation; event availability depends on eligibility | Context-specific instructions, dismissible prompt |
| Push | WebKit documents 16.4+ Home Screen support with user interaction for permission | Supported subject to permission, OS and browser restrictions | In-app updates; no guaranteed delivery |
| Background Sync | Do not depend on support | Available in supporting Chromium versions; scheduling not guaranteed | Foreground/manual retry |
| Vibration | Do not rely on Safari vibration | Feature-detect; hardware/settings/user activation can prevent it | Visual feedback; no fake haptic promises |
| Virtual keyboard | Visual/layout viewport behaviour and standalone bugs require testing | Resize policy varies; VirtualKeyboard API is optional | Scroll-flow forms and tested viewport enhancement |
| Service worker/cache | Secure context; lifetime and storage limits | Same broad model, different resource policies | Online error state; recover from eviction |
| Safe area | Insets for edge-to-edge layout | Insets/device modes can vary | Base padding via max() |
| Back gestures | OS edge gesture must remain available; test installed separately | System back/history and close requests differ | Real links, router history, visible close |
| Offline durability | Storage can be evicted; no indefinite background execution | Same limitation | Server sync/export where appropriate |

## Physical-device test sheet
For each run record device model, OS/build, browser version, tab/installed mode, network, build ID, date, tester, result and evidence. Run at least one supported iPhone and one constrained Android; also test oldest supported versions before claiming support.

- Install fresh; inspect icon crop/name, launch, deep link, external link and standalone navigation.
- Focus every form near bottom; open/close keyboard, autofill, rotate, zoom and use large system text. No hidden submit control or trapped scroll.
- Pinch zoom and select/copy reading text. Check double tap where intentionally scoped.
- VoiceOver/TalkBack: landmarks, names, error announcements, dialog focus containment/return, reading order, drag alternative. External keyboard focus remains visible.
- Scroll long content, open a sheet at nonzero scroll, dismiss, navigate detail/back. Preserve intended positions without jumps.
- Perform OS edge-back/system back and pull-to-refresh; ensure nested scroll/swipe regions don't trap gestures.
- Enable reduced motion; test dark/light and high contrast where available. Check 200% text and 320px reflow separately.
- Background/kill/resume, low memory and storage eviction; verify permitted state recovery.
- Slow/offline requests, auth expiry, logout/account change in another tab; no private cached response leakage.
- Upgrade from previous deployed build with two tabs and unsaved work; no reload loop, missing chunks or silent data loss.
- Push grant/deny/revoke and real notification delivery where implemented; unsupported APIs degrade gracefully.

Playwright WebKit is not iOS Safari and mobile viewport emulation is not physical-device validation. Leave rows NOT RUN until actually observed.
