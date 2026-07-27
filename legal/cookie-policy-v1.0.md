# Cookie Policy

**Sunsynk System Performance Report Service (SSPRS)**  
**Operator:** Sunsynk Limited (Company Registration Number 08778087), trading as Sunsynk UK Ltd  
**Registered office:** Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom  

**Version:** 1.0  
**Effective date:** 27 July 2026  
**Related:** Privacy Policy v3.0  

**Privacy contact:** privacy@sunsynk.com  

> Draft for solicitor review. Exact cookie names/durations marked **[TO CONFIRM]** must be completed by engineering before final publication.

---

## 1. What this Policy covers

This Cookie Policy explains how Sunsynk Limited uses cookies and similar technologies (local storage, pixels, SDKs, tags) on the Service and related sites (including sunsynkreports.com), and how the Privacy and Electronic Communications Regulations 2003 (“**PECR**”) apply.

For wider personal-data processing, see our Privacy Policy.

---

## 2. PECR in plain legal English

Under PECR, we must obtain **prior consent** before storing or accessing information on your device, unless the technology is **strictly necessary** to provide a service you have requested (for example, authentication or security).

Consent must be freely given, specific, informed and unambiguous. Pre-ticked optional boxes are not valid. You must be able to reject non-essential technologies as easily as you accept them. Withdrawing consent must be as easy as giving it.

**Accepting our Terms or Privacy Policy does not equal consent to optional cookies or analytics.**

---

## 3. Categories used by SSPRS

| Category | Examples | Can you refuse? |
|---|---|---|
| Strictly necessary | Auth/session/security, load balancing, consent preference storage, core app function | No — required to use the Service |
| Analytics | Google Analytics 4 (GA4) | Yes |
| Session replay | Microsoft Clarity | Yes |
| Diagnostics / error monitoring | Sentry (when configured) | Yes |
| Product analytics | PostHog analytics (when configured) | Yes |
| Product session replay | PostHog replay (when configured) | Yes |

On the marketing website, the optional technology currently loaded after consent is **Microsoft Clarity** (session replay). Additional categories apply in the SSPRS web application when those tools are configured.

---

## 4. Session replay (Microsoft Clarity)

If you consent to session replay, Microsoft Clarity may record page interactions, clicks, scrolling, device/browser information and on-screen content. Recordings may include identifiers or report content visible on screen. Passwords and payment card fields must be masked where those flows exist; you should still reject session replay if you do not want interaction recording.

Clarity is not anonymous analytics. Session recordings of identifiable users interacting with device or report data are personal data.

---

## 5. What happens if you choose “Reject non-essential”

Strictly necessary technologies continue. GA4, Clarity, Sentry and PostHog (and equivalent optional SDKs) must **not** load or set non-essential cookies. Core reporting features remain available.

---

## 6. How to change preferences

- Cookie banner on first visit (and when consent version changes).
- Footer **Cookie settings** / **Manage cookies**.
- In-app: **Settings → Privacy and cookies** (when signed in; preferences may sync to your account).

Browser controls can also block cookies, but may break necessary functions and do not replace our preference centre for category-level consent.

---

## 7. Vendor links (informational)

- Google Analytics: https://policies.google.com/privacy
- Microsoft Clarity: https://privacy.microsoft.com/privacystatement
- Stripe (payments; not an optional analytics cookie category): https://stripe.com/privacy
- Firebase / Google: https://firebase.google.com/support/privacy
- Sentry: https://sentry.io/privacy/ **[if enabled]**
- PostHog: https://posthog.com/privacy **[if enabled]**

---

## 8. Cookie / SDK schedule

Exact cookie names, durations and hosts must be completed by engineering. Known / expected entries include:

| Name | Provider | Purpose | Type | Duration | Category | First / third party |
|---|---|---|---|---|---|---|
| `srp_cookie_consent` / equivalent | Sunsynk | Store consent version & categories | localStorage / cookie | **[TO CONFIRM]** | Strictly necessary | First |
| Auth session cookie(s) | Firebase / Sunsynk | Authenticated session | cookie | **[TO CONFIRM]** | Strictly necessary | First / third |
| CSRF / security | Sunsynk | Security | cookie | Session / **[TO CONFIRM]** | Strictly necessary | First |
| `_ga` / `_ga_*` | Google | GA4 analytics | cookie | up to ~2 years typical | Analytics | Third |
| Clarity cookies (e.g. `_clck`, `_clsk`) | Microsoft | Session replay / heatmaps | cookie | **[TO CONFIRM]** | Session replay | Third |
| Sentry SDK storage | Sentry | Error monitoring | SDK / cookie | **[TO CONFIRM]** | Diagnostics | Third |
| PostHog cookies | PostHog | Product analytics / replay | cookie / SDK | **[TO CONFIRM]** | Product analytics / Product session replay | Third |

Until completed, treat the category descriptions in Section 3 as controlling for consent UX.

---

## 9. Changes

If we add categories/vendors or materially change optional technologies, we will update this Policy and may require **fresh consent** (consent version bump).

---

## 10. Contact

**Sunsynk Limited — Privacy**  
Email: privacy@sunsynk.com  
Postal: Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom
