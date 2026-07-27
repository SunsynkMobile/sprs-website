# Privacy Policy

**Sunsynk System Performance Report Service (SSPRS)**  
**Operator:** Sunsynk Limited (Company Registration Number 08778087), trading as Sunsynk UK Ltd  
**Registered office:** Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom  

**Version:** 3.0  
**Effective date:** 27 July 2026  
**Previous version:** 2.0 (19 June 2026)  

**Privacy contact:** privacy@sunsynk.com  
**Support contact:** support@sunsynk.com  

> Draft for solicitor review. Items marked **[TO CONFIRM]** must be verified before final publication.

---

## 1. Who we are

This Privacy Policy explains how **Sunsynk Limited** (Company Registration Number **08778087**), trading as **Sunsynk UK Ltd** (“**Sunsynk**”, “**we**”, “**us**”, “**our**”), processes personal data in connection with the **Sunsynk System Performance Report Service** (“**SSPRS**”, “**Service**”), including the web application and related websites such as sunsynkreports.com.

**Registered office:** Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom.

**Privacy contact:** privacy@sunsynk.com  
**Support contact:** support@sunsynk.com  

**Data Protection Officer:** We have not appointed a statutory Data Protection Officer. **[TO CONFIRM: if a DPO or privacy lead is appointed, insert name/contact.]** Privacy enquiries should be sent to privacy@sunsynk.com.

We are the **controller** of personal data processed for SSPRS account administration, authentication integration, report generation and storage within SSPRS, credits and billing records, support, security, audit logging, and (where applicable) analytics consent records, except where this Policy states otherwise (including where a vendor acts as an independent controller, or where you act as an independent controller of end-customer data).

---

## 2. Scope and audience

The Service enables **authorised users** to generate performance reports for Sunsynk-connected systems. Access is restricted (allow-listed / invitation / controlled rollout). Sign-in uses Sunsynk account credentials shared with other Sunsynk applications (for example Saver / Connect Pro) via Firebase authentication.

This Policy is drafted primarily for **authorised business users** (installers, partners, and staff). If you use the Service as a **consumer**, mandatory consumer and data-protection rights that cannot be excluded will still apply.

The Service is intended for individuals aged **18 or over**. We do not knowingly offer the Service to children.

---

## 3. Categories of personal data we process

| Category | Examples |
|---|---|
| Identity / account | Name, email address, user ID, Firebase authentication ID, role and permissions |
| Authorisation / access | Customer, installer, staff or admin status; device or site access entitlements |
| Device / system / telemetry | Device IDs, plant/site IDs, inverter and battery telemetry, status, performance readings, faults, selected date ranges |
| Report artefacts | Report inputs, generated content, stored PDFs, history, timestamps, download events |
| Payments / credits | Credit purchases and balances, Stripe checkout / payment intent references, refunds, purchase history (full card details are **not** stored in the SSPRS web app) |
| Support / admin / audit | Support requests, refund decisions, audit logs, admin actions, staff role assignments, investigations |
| Technical / security | IP address, headers, browser information, session cookies, logs, errors, rate limits, security events |
| Analytics / interaction (if consented) | Page views, feature usage, custom events, approximate location derived from IP, referrals; session recordings, heatmaps, clicks, scrolling, on-screen content, interaction patterns |
| Communications | Support correspondence |

We do **not** intentionally collect special category data. You must not enter special category data into the Service. If such data is incidentally captured (for example on-screen in a session recording), we will treat it as restricted and seek to minimise and delete it where practicable.

**Important:** Device IDs, site/plant IDs, Stripe session identifiers, and session recordings may constitute **personal data** (including where pseudonymous) because they can identify or be linked to an individual or household installation in combination with other data. We do not treat them as anonymous unless and until they are irreversibly anonymised.

---

## 4. Sources of personal data

- **You**, when you create or use an account, configure tariffs, generate reports, purchase credits, or contact support.
- **Your Sunsynk account / authentication providers** (including Firebase) for sign-in and identity.
- **Telemetry and connected systems** associated with devices/sites you are authorised to access.
- **Payment providers** (Stripe) for payment status and references.
- **Your device and browser**, via cookies, SDKs, and similar technologies (see Cookie Policy).
- **Our staff / administrators**, when performing support, refund, security, or role-management actions.
- **Automated systems**, including security logging and (if consented) analytics/session-replay tools.

---

## 5. Purposes and lawful bases

| Purpose | Lawful basis (UK GDPR / EU GDPR) |
|---|---|
| Authenticate users; maintain sessions; enforce allow-listing and roles | Art. 6(1)(b) contract; Art. 6(1)(f) legitimate interests (security/access control) |
| Authorise device/site access and prevent unauthorised viewing | Art. 6(1)(b); Art. 6(1)(f) |
| Generate, store, regenerate, display, download and delete reports | Art. 6(1)(b) |
| Administer credits, checkout, payment confirmation, balances and refunds | Art. 6(1)(b); Art. 6(1)(c) legal obligation (tax/accounting where applicable) |
| Provide support and investigate service issues | Art. 6(1)(b); Art. 6(1)(f) |
| Security, fraud prevention, rate limiting, abuse detection, audit logging | Art. 6(1)(f); Art. 6(1)(c) where legally required |
| Admin tools (search users; view report/credit/purchase/refund history; manage staff roles; issue refunds) | Art. 6(1)(f) (service administration / integrity); Art. 6(1)(b) as needed to perform the contract |
| Service improvement using non-cookie server-side operational metrics that do not require PECR consent | Art. 6(1)(f), subject to balancing |
| Optional analytics (e.g. GA4), session replay (e.g. Clarity), diagnostics (e.g. Sentry), product analytics / product session replay (e.g. PostHog) involving cookies/SDKs or equivalent device storage/access | **Consent** Art. 6(1)(a) **and** PECR consent for storage/access on the device |
| Comply with legal claims, regulatory requests, tax and accounting duties | Art. 6(1)(c); Art. 6(1)(f) |

**PECR note:** For non-essential cookies and similar technologies, we rely on **prior consent** under the Privacy and Electronic Communications Regulations 2003. Accepting the Terms or this Privacy Policy does **not** constitute cookie/analytics consent.

---

## 6. Legitimate interests: balancing summary

Where we rely on legitimate interests, our interests include: securing the Service; preventing fraud and unauthorised access; maintaining auditability of admin actions; operating a B2B allow-listed reporting platform; and improving reliability. We consider the impact on individuals (including authorised users and, indirectly, end customers whose site/device data appears in reports), the sensitivity of telemetry-linked identifiers, the restricted access model, and available safeguards (access controls, logging, retention limits, and PECR consent for optional monitoring technologies). You may object to processing based on legitimate interests; we will assess objections unless an exemption applies.

---

## 7. Cookies, analytics and session replay

We use strictly necessary cookies for authentication, security and core functionality. Optional technologies are consent-gated and described in the **Cookie Policy**, including:

- **Google Analytics 4 (GA4):** usage analytics and custom events (may include device IDs, date ranges, credit/purchase metadata, Stripe session IDs, feature flags). We instruct engineering not to send email addresses, Firebase UIDs, or obvious direct identifiers to GA4; residual linkable identifiers may still be personal data.
- **Microsoft Clarity:** session recordings, heatmaps and interaction data, which may capture on-screen content visible during your session.
- **Sentry** (when configured): error/diagnostics monitoring.
- **PostHog** (when configured): product analytics and/or product session replay.

**Session replay risks:** Recordings may show names, emails, customer/site identifiers, tariff inputs, report content and other on-screen information. We require technical safeguards including input masking where configured, exclusion of highly sensitive flows where practicable (authentication, payment entry, certain admin views), and access controls for staff who can view recordings. You can reject session replay while still using the Service.

Consent preferences are stored in a first-party consent record and, when you are signed in, may be synced to your account. You can change preferences via Cookie settings (footer) and, in-app, Settings → Privacy and cookies.

---

## 8. Recipients and categories of recipients

We may disclose personal data to:

- **Infrastructure and auth providers** (including Firebase / Google Cloud hosting and authentication components): **[TO CONFIRM exact hosting stack]**.
- **Stripe:** payment processing.
- **Analytics / monitoring vendors** (if consented): Google (GA4), Microsoft (Clarity), Sentry, PostHog: as configured.
- **Sunsynk staff administrators / super-administrators** with elevated access for support, refunds, security and operations.
- **Professional advisers** (legal, accounting) under confidentiality.
- **Authorities** where required by law or to establish, exercise or defend legal claims.
- **Successor entities** in connection with a corporate transaction, subject to appropriate safeguards.

We do not sell personal data.

---

## 9. International transfers

Providers may process personal data outside the United Kingdom and/or European Economic Area, including in the United States (notably Google, Microsoft, Firebase/Google Cloud, Stripe, and potentially Sentry/PostHog if enabled).

Where a transfer is restricted under UK/EU GDPR, we rely on one or more lawful mechanisms, which may include: an adequacy regulation; the EU Standard Contractual Clauses; the UK International Data Transfer Agreement and/or UK Addendum; and supplementary measures where appropriate. **[TO CONFIRM: list executed transfer tools per vendor before asserting them as current.]**

We do **not** claim that personal data never leaves the UK.

---

## 10. Retention

| Record type | Retention criterion (operational target) |
|---|---|
| Account / auth profile data | For the life of the account + up to 24 months after closure, unless longer needed for disputes/security |
| Reports and related artefacts | Typically 24 months from generation or last access, unless you delete earlier or a dispute requires longer **[TO CONFIRM]** |
| Payment / credit / refund records | Normally 6–7 years (tax/accounting) |
| Support tickets | Typically 24 months after closure |
| Security / audit logs | Typically 12–24 months |
| Analytics / session replay in vendor tools | Per vendor configuration and consent; target ≤ 13 months unless shorter configured **[TO CONFIRM]** |
| Cookie consent records | At least 24 months (evidence of compliance) |

---

## 11. Security

We implement appropriate technical and organisational measures designed to protect personal data, which may include encryption in transit (HTTPS), access controls, role-based admin permissions, audit logging, and staff confidentiality obligations. No method of transmission or storage is completely secure. We do not guarantee absolute security.

---

## 12. Administrator access (important disclosure)

Authorised Sunsynk administrators may:

- search for users;
- view report, credit, purchase and refund history;
- generate or delete reports in support/operations contexts;
- issue refunds; and
- (super-administrators) manage staff roles.

Admin actions are logged. By using the Service you acknowledge that such access may occur for legitimate operational, support, security and compliance purposes.

---

## 13. Your rights

Under UK GDPR (and EU GDPR where applicable), you may have the right to: access; rectification; erasure; restriction; objection; data portability; and withdrawal of consent (without affecting prior lawful processing).

To exercise rights, email **privacy@sunsynk.com**. We may need to verify your identity. We will respond within **one month**, extendable by two further months for complex requests (we will explain any extension).

**Complaints:** You may lodge a complaint with the UK Information Commissioner’s Office (ICO) (ico.org.uk). If you are in the EEA, you may also complain to your local supervisory authority. We would appreciate the chance to address concerns first via privacy@sunsynk.com.

---

## 14. Automated processing

Report scores, flags and indicators are **automated calculations** based on telemetry, your selections and our methods. They support operational insight and human review. They are **not** intended to produce solely automated decisions that produce legal effects or similarly significant effects concerning you within the meaning of Article 22 UK/EU GDPR. If that position changes, we will update this Policy.

---

## 15. End-customer / site data accessed by business users

If you are an installer, partner or other business user, you must only access devices, sites and reports you are authorised to view. You are responsible for having a lawful basis and appropriate notices/authority in respect of any end-customer personal data you cause to be processed through the Service. Depending on the facts, you may be an **independent controller** of that end-customer data.

---

## 16. Children’s data

The Service is for adults and authorised business users only (18+). If we become aware that a child has provided personal data, we will take reasonable steps to delete it.

---

## 17. Changes

We may update this Privacy Policy. Material changes will be notified in-app and/or by email where appropriate, and may require **re-acceptance** of the updated version before continued use. The version number and effective date appear at the top of this Policy. Cookie preference changes are handled separately under the Cookie Policy and do not replace Privacy Policy acceptance.

---

## 18. Contact

**Sunsynk Limited: Privacy**  
Email: privacy@sunsynk.com  
Postal: Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom
