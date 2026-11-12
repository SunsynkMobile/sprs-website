# Sunsynk System Performance Report Service (SSPRS): Legal Policy Suite v3.0

**Operator:** Sunsynk Limited (Company Registration Number 08778087), trading as Sunsynk UK Ltd  
**Registered office:** Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom  
**Privacy:** privacy@sunsynk.com | **Support:** support@sunsynk.com  
**Governing law preference:** England and Wales (subject to mandatory local rights)  
**Document suite effective date:** 27 July 2026  
**Versions:** Privacy Policy v3.0 · Terms and Conditions v3.0 · Cookie Policy v1.0 · Cookie consent UX copy v1.0  

> **Status note.** These drafts are prepared for solicitor review and product implementation. Items marked **[TO CONFIRM]** must be verified before go-live. Do not treat this suite as a certification of GDPR/PECR compliance.

---

## Contents

1. [Executive legal memo](#1-executive-legal-memo)
2. [Gap analysis and redlined recommendations vs current baseline](#2-gap-analysis-and-redlined-recommendations-vs-current-baseline)
3. [Privacy Policy v3.0](#3-privacy-policy-v30)
4. [Terms and Conditions v3.0](#4-terms-and-conditions-v30)
5. [Cookie Policy v1.0](#5-cookie-policy-v10)
6. [Cookie banner and preference-centre copy](#6-cookie-banner-and-preference-centre-copy)
7. [Controller / processor matrix](#7-controller--processor-matrix)
8. [Retention schedule](#8-retention-schedule)
9. [Cookie / technology schedule template](#9-cookie--technology-schedule-template)
10. [Analytics technology legal analysis](#10-analytics-technology-legal-analysis)
11. [Open questions / facts still needed](#11-open-questions--facts-still-needed)
12. [Implementation checklist](#12-implementation-checklist)
13. [Change log and versioning clause](#13-change-log-and-versioning-clause)

---

## 1. Executive legal memo

### 1.1 Scope and audience

This memo accompanies the v3.0 user-facing policies for the Sunsynk System Performance Report Service (“**SSPRS**” / “**Service**”). The Service is operated by Sunsynk Limited for authorised business users (installers, partners, staff) and, where allow-listed, other authorised account holders. Drafting is primarily B2B under English law, with Consumer Rights Act 2015 carve-outs where a consumer uses the Service.

### 1.2 Key residual risks (regulator-defensible position)

| Risk | Assessment | Mitigation in drafts / required engineering |
|---|---|---|
| **PECR consent vs Terms acceptance** | High if blurred. Non-essential cookies/SDKs require prior consent under PECR. Terms/Privacy acceptance must not activate analytics. | Policies and banner copy separate consent from contract acceptance. Engineering must gate scripts. |
| **Microsoft Clarity session replay** | High. On-screen capture may include names, emails, device/site IDs, tariffs, report content, and (if unmasked) form inputs. Systematic monitoring likely triggers DPIA expectation under ICO guidance. | Consent category; transparency; masking/exclusion requirements; DPIA recommendation; access controls. |
| **GA4 custom events with device IDs / Stripe session IDs** | Medium to high. Identifiers are personal data or linkable personal data unless proven otherwise. | Disclose as personal data; minimise; no email/Firebase UID; retention caps; consent gate. |
| **International transfers (USA vendors)** | Medium to high. Google, Microsoft, Firebase/Google Cloud, Stripe (and Sentry/PostHog if enabled) may process outside UK/EEA. | Honest transfer wording; require adequacy / SCCs / UK IDTA or Addendum: **[TO CONFIRM]** which tools are in place. |
| **Admin elevated access** | Medium. Staff can view user/report/credit/refund data. Fairness and confidentiality risk if undisclosed. | Privacy disclosure + Terms acknowledgement + audit logging. |
| **Report accuracy / reliance** | Commercial. Users may treat indicative scores as advice. | Strong non-reliance, telemetry dependency, and liability allocation in Terms. |
| **Installer / end-customer data** | Medium. Reports may contain end-customer/site data. Controller relationships can be dual/independent. | Business-user warranty of authority; confidentiality; matrix appendix. |
| **Vendor role mischaracterisation** | Medium. Defaulting Google/Microsoft to “processor only” may be inaccurate where they determine purposes (ads, product improvement). | Draft as independent controllers for certain analytics purposes unless a DPA confirms processor status. **[TO CONFIRM]** |

### 1.3 GDPR / PECR analytics findings (headline)

1. **PECR is the gate for device storage/access.** Legitimate interests cannot replace PECR consent for non-essential analytics, session replay, product analytics, or optional diagnostics cookies/SDKs.
2. **Consent must be granular, equal-prominence reject, not pre-ticked, and withdrawable.** Banner must offer Accept all / Reject non-essential / Manage preferences with equal visual weight for reject.
3. **Clarity is not “anonymous analytics”.** Session recordings of authenticated business users interacting with identifiable device/report content are personal data.
4. **Device IDs in GA events are personal data (or pseudonymous personal data).** Treat as such in transparency notices.
5. **Sentry / PostHog categories already in the product consent model must be described** even if not yet live, and must not load without category consent.
6. **DPIA recommended** before (or promptly upon) continued use of Clarity and identifier-rich GA4 events at scale.

### 1.4 Inconsistencies resolved in v3.0

| Issue | Resolution |
|---|---|
| Terms suggesting analytics may activate after Privacy Policy acceptance | Removed. Optional technologies load only after PECR consent for the relevant category. |
| Vague “as long as necessary” retention | Replaced with category retention schedule / criteria (subject to **[TO CONFIRM]** operational fit). |
| Underspecified vendor roles / transfers | Explicit matrix; no “data never leaves UK” claim. |
| Incomplete cookie schedule | Template + categories; engineering must complete exact cookie names/durations. |
| Marketing-site policies using “SunsynkMobile” and thin content | Replaced with Sunsynk Limited / SSPRS v3.0 suite. |

### 1.5 Engineering prerequisites for truthful policies

Policies are only accurate if engineering implements:

- Prior consent gating for GA4, Clarity, Sentry, PostHog (no pre-load / no beacon before consent).
- Separate category toggles (analytics vs session replay vs diagnostics vs product analytics / product replay).
- Masking of passwords, payment fields, and sensitive inputs in replay tools; exclude auth, checkout, and admin PII-heavy views where feasible.
- No email, Firebase UID, full names, or free-text support content in analytics payloads.
- Consent record retention (version, timestamp, preferences, source).
- Material vendor/category change → re-prompt consent (bump consent version).
- Transfer tools and DPAs documented for each vendor.
- Vendor console retention caps and access controls for recordings.

### 1.6 DPIA recommendation

**Recommendation:** Complete a DPIA covering Clarity (and PostHog replay if enabled), GA4 custom events containing device/Stripe identifiers, admin monitoring of recordings, and international transfers. Residual high-risk finding: session replay may capture on-screen personal data of end customers indirectly via reports. Do not claim “low risk” without completing the DPIA.

---

## 2. Gap analysis and redlined recommendations vs current baseline

*Baseline reviewed: marketing-site Privacy / Terms / Cookie pages (dated 8 June 2026, effectively pre-v2.0 thin notices) and the product brief describing v2.0 themes effective 19 June 2026.*

### 2.1 Must-change redlines

1. **Controller identity:** Replace “SunsynkMobile” with **Sunsynk Limited (08778087)** and registered office; trading name Sunsynk UK Ltd.
2. **Separate PECR consent from contract acceptance:** Delete any clause implying Privacy/Terms acceptance enables analytics. Insert express non-equivalence statement in Terms, Privacy, Cookie Policy, and banner.
3. **Session replay transparency:** Add dedicated Clarity disclosure (nature, risks, masking expectations, consent basis).
4. **Lawful bases table:** Replace unstructured “how we use” lists with purpose → lawful basis mapping.
5. **Personal data categories:** Add Firebase auth IDs, roles, credits, admin/audit logs, session recordings, custom analytics identifiers.
6. **Admin access:** Disclose search, report/credit/refund visibility, role management, logging; obtain contractual acknowledgement.
7. **Credits / refunds:** Align one-credit-per-successful-generation; 14-day unused refund window; used credits generally non-refundable.
8. **Non-reliance:** Strengthen report-as-indicative-insight language; exclude professional advice warranties.
9. **Liability:** B2B cap at fees paid in prior 12 months (or amount paid for relevant credits), with mandatory carve-outs; consumer law preservation.
10. **International transfers:** Name vendors; require lawful transfer mechanism wording with **[TO CONFIRM]** placeholders where DPA/SCC status unknown.
11. **Retention:** Publish schedule by data category.
12. **Cookie categories:** Align to necessary / analytics (GA4) / session replay (Clarity) / diagnostics (Sentry) / product analytics (PostHog) / product session replay (PostHog).
13. **Rights / complaints:** Explicit UK GDPR rights, ICO complaint route, EEA SA route where applicable; one-month response (extendable).
14. **Children:** Adults / authorised business users only (18+).
15. **Versioned re-acceptance:** Material Terms/Privacy updates require affirmative re-acceptance; cookie material changes require fresh consent.

### 2.2 Claims to remove or qualify

- Do not claim anonymised analytics where identifiers/recordings exist.
- Do not claim “we do not use cookies for advertising profiles” without verifying GA4 Google Signals / ads features are disabled: state configuration obligation instead.
- Do not claim penetration testing / audits as fact unless true: use “appropriate technical and organisational measures” language.
- Do not claim GDPR certification.

---

## 3. Privacy Policy v3.0

**Version:** 3.0  
**Effective date:** 27 July 2026  
**Previous version:** 2.0 (19 June 2026)  

### 3.1 Who we are

This Privacy Policy explains how **Sunsynk Limited** (Company Registration Number **08778087**), trading as **Sunsynk UK Ltd** (“**Sunsynk**”, “**we**”, “**us**”, “**our**”), processes personal data in connection with the **Sunsynk System Performance Report Service** (“**SSPRS**”, “**Service**”), including the web application and related websites such as sunsynkreports.com.

**Registered office:** Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom.

**Privacy contact:** privacy@sunsynk.com  
**Support contact:** support@sunsynk.com  

**Data Protection Officer:** We have not appointed a statutory Data Protection Officer. **[TO CONFIRM: if a DPO or privacy lead is appointed, insert name/contact.]** Privacy enquiries should be sent to privacy@sunsynk.com.

We are the **controller** of personal data processed for SSPRS account administration, authentication integration, report generation and storage within SSPRS, credits and billing records, support, security, audit logging, and (where applicable) analytics consent records, except where this Policy states otherwise (including where a vendor acts as an independent controller, or where you act as an independent controller of end-customer data).

### 3.2 Scope and audience

The Service enables **authorised users** to generate performance reports for Sunsynk-connected systems. Access is restricted (allow-listed / invitation / controlled rollout). Sign-in uses Sunsynk account credentials shared with other Sunsynk applications (for example Saver / Connect Pro) via Firebase authentication.

This Policy is drafted primarily for **authorised business users** (installers, partners, and staff). If you use the Service as a **consumer**, mandatory consumer and data-protection rights that cannot be excluded will still apply.

The Service is intended for individuals aged **18 or over**. We do not knowingly offer the Service to children.

### 3.3 Categories of personal data we process

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

### 3.4 Sources of personal data

- **You**, when you create or use an account, configure tariffs, generate reports, purchase credits, or contact support.
- **Your Sunsynk account / authentication providers** (including Firebase) for sign-in and identity.
- **Telemetry and connected systems** associated with devices/sites you are authorised to access.
- **Payment providers** (Stripe) for payment status and references.
- **Your device and browser**, via cookies, SDKs, and similar technologies (see Cookie Policy).
- **Our staff / administrators**, when performing support, refund, security, or role-management actions.
- **Automated systems**, including security logging and (if consented) analytics/session-replay tools.

### 3.5 Purposes and lawful bases

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

### 3.6 Legitimate interests: balancing summary

Where we rely on legitimate interests, our interests include: securing the Service; preventing fraud and unauthorised access; maintaining auditability of admin actions; operating a B2B allow-listed reporting platform; and improving reliability. We consider the impact on individuals (including authorised users and, indirectly, end customers whose site/device data appears in reports), the sensitivity of telemetry-linked identifiers, the restricted access model, and available safeguards (access controls, logging, retention limits, and PECR consent for optional monitoring technologies). You may object to processing based on legitimate interests; we will assess objections unless an exemption applies.

### 3.7 Cookies, analytics and session replay

We use strictly necessary cookies for authentication, security and core functionality. Optional technologies are consent-gated and described in the **Cookie Policy**, including:

- **Google Analytics 4 (GA4)**: usage analytics and custom events (may include device IDs, date ranges, credit/purchase metadata, Stripe session IDs, feature flags). We instruct engineering not to send email addresses, Firebase UIDs, or obvious direct identifiers to GA4; residual linkable identifiers may still be personal data.
- **Microsoft Clarity**: session recordings, heatmaps and interaction data, which may capture on-screen content visible during your session.
- **Sentry** (when configured): error/diagnostics monitoring.
- **PostHog** (when configured): product analytics and/or product session replay.

**Session replay risks:** Recordings may show names, emails, customer/site identifiers, tariff inputs, report content and other on-screen information. We require technical safeguards including input masking where configured, exclusion of highly sensitive flows where practicable (authentication, payment entry, certain admin views), and access controls for staff who can view recordings. You can reject session replay while still using the Service.

Consent preferences are stored in a first-party consent record and, when you are signed in, may be synced to your account. You can change preferences via Cookie settings (footer) and, in-app, Settings → Privacy and cookies.

### 3.8 Recipients and categories of recipients

We may disclose personal data to:

- **Infrastructure and auth providers** (including Firebase / Google Cloud hosting and authentication components): **[TO CONFIRM exact hosting stack]**.
- **Stripe**: payment processing.
- **Analytics / monitoring vendors** (if consented): Google (GA4), Microsoft (Clarity), Sentry, PostHog: as configured.
- **Sunsynk staff administrators / super-administrators** with elevated access for support, refunds, security and operations.
- **Professional advisers** (legal, accounting) under confidentiality.
- **Authorities** where required by law or to establish, exercise or defend legal claims.
- **Successor entities** in connection with a corporate transaction, subject to appropriate safeguards.

We do not sell personal data.

### 3.9 International transfers

Providers may process personal data outside the United Kingdom and/or European Economic Area, including in the United States (notably Google, Microsoft, Firebase/Google Cloud, Stripe, and potentially Sentry/PostHog if enabled).

Where a transfer is restricted under UK/EU GDPR, we rely on one or more lawful mechanisms, which may include: an adequacy regulation; the EU Standard Contractual Clauses; the UK International Data Transfer Agreement and/or UK Addendum; and supplementary measures where appropriate. **[TO CONFIRM: list executed transfer tools per vendor before asserting them as current.]**

We do **not** claim that personal data never leaves the UK.

### 3.10 Retention

See the **Retention schedule** in this suite (Section 8). In summary:

| Record type | Retention criterion (operational target) |
|---|---|
| Account / auth profile data | For the life of the account + up to 24 months after closure, unless longer needed for disputes/security |
| Reports and related artefacts | Typically 24 months from generation or last access, unless you delete earlier or a dispute requires longer **[TO CONFIRM]** |
| Payment / credit / refund records | Normally 6-7 years (tax/accounting) |
| Support tickets | Typically 24 months after closure |
| Security / audit logs | Typically 12-24 months |
| Analytics / session replay in vendor tools | Per vendor configuration and consent; target ≤ 13 months unless shorter configured **[TO CONFIRM]** |
| Cookie consent records | At least 24 months (evidence of compliance) |

### 3.11 Security

We implement appropriate technical and organisational measures designed to protect personal data, which may include encryption in transit (HTTPS), access controls, role-based admin permissions, audit logging, and staff confidentiality obligations. No method of transmission or storage is completely secure. We do not guarantee absolute security.

### 3.12 Administrator access (important disclosure)

Authorised Sunsynk administrators may:

- search for users;
- view report, credit, purchase and refund history;
- generate or delete reports in support/operations contexts;
- issue refunds; and
- (super-administrators) manage staff roles.

Admin actions are logged. By using the Service you acknowledge that such access may occur for legitimate operational, support, security and compliance purposes.

### 3.13 Your rights

Under UK GDPR (and EU GDPR where applicable), you may have the right to: access; rectification; erasure; restriction; objection; data portability; and withdrawal of consent (without affecting prior lawful processing).

To exercise rights, email **privacy@sunsynk.com**. We may need to verify your identity. We will respond within **one month**, extendable by two further months for complex requests (we will explain any extension).

**Complaints:** You may lodge a complaint with the UK Information Commissioner’s Office (ICO) (ico.org.uk). If you are in the EEA, you may also complain to your local supervisory authority. We would appreciate the chance to address concerns first via privacy@sunsynk.com.

### 3.14 Automated processing

Report scores, flags and indicators are **automated calculations** based on telemetry, your selections and our methods. They support operational insight and human review. They are **not** intended to produce solely automated decisions that produce legal effects or similarly significant effects concerning you within the meaning of Article 22 UK/EU GDPR. If that position changes, we will update this Policy.

### 3.15 End-customer / site data accessed by business users

If you are an installer, partner or other business user, you must only access devices, sites and reports you are authorised to view. You are responsible for having a lawful basis and appropriate notices/authority in respect of any end-customer personal data you cause to be processed through the Service. Depending on the facts, you may be an **independent controller** of that end-customer data.

### 3.16 Children’s data

The Service is for adults and authorised business users only (18+). If we become aware that a child has provided personal data, we will take reasonable steps to delete it.

### 3.17 Changes

We may update this Privacy Policy. Material changes will be notified in-app and/or by email where appropriate, and may require **re-acceptance** of the updated version before continued use. The version number and effective date appear at the top of this Policy. Cookie preference changes are handled separately under the Cookie Policy and do not replace Privacy Policy acceptance.

### 3.18 Contact

**Sunsynk Limited: Privacy**  
Email: privacy@sunsynk.com  
Postal: Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom

---

## 4. Terms and Conditions v3.0

**Version:** 3.0  
**Effective date:** 27 July 2026  
**Previous version:** 2.0 (19 June 2026)  

### 4.1 Agreement and capacity

These Terms and Conditions (“**Terms**”) form a legally binding contract between you and **Sunsynk Limited** (Company Registration Number **08778087**), trading as **Sunsynk UK Ltd** (“**Sunsynk**”, “**we**”, “**us**”, “**our**”), for use of the Sunsynk System Performance Report Service (“**Service**”).

By accessing or using the Service, or by clicking to accept these Terms, you agree to be bound by them. If you accept on behalf of an organisation, you represent that you have authority to bind that organisation. If you do not agree, you must not use the Service.

**Consumers:** If you are a consumer, nothing in these Terms excludes mandatory rights under the Consumer Rights Act 2015 or other non-excludable law. Provisions aimed at business users apply to the maximum extent permitted.

### 4.2 Eligibility, authorised access and allow-listing

1. You must be at least 18 years old.
2. Access is restricted to allow-listed / invited / otherwise authorised users.
3. You must only access devices, sites and reports you are authorised to view.
4. We may refuse, suspend or revoke access where authorisation is unclear, withdrawn, or suspected to be abused.

### 4.3 Accounts and security

1. Sign-in uses Sunsynk account credentials shared with other Sunsynk apps via Firebase authentication.
2. You must keep credentials confidential and use appropriate account security.
3. You must notify support@sunsynk.com promptly of suspected unauthorised access.
4. You are responsible for activity under your account unless caused by our proven breach of these Terms.

### 4.4 Service description

The Service enables authorised users to generate performance reports for Sunsynk-connected systems. Reports may include system performance, battery health, solar utilisation, grid dependency, evening grid dependency, inverter clipping, faults, estimated savings, period analysis and related indicators.

Reports are generated from telemetry, your selections (including tariffs and date ranges) and our calculation methods.

### 4.5 Report non-reliance and accuracy limitations

1. Reports provide **indicative operational insight only**.
2. Reports are **not** professional electrical, engineering, safety, warranty, installation, financial, tax or investment advice.
3. Outputs depend on telemetry quality, device configuration, selected inputs and calculation methods. Data may be incomplete, delayed or inaccurate.
4. You must not rely on reports as the sole basis for safety-critical, contractual, warranty or financial decisions.
5. Estimated savings and similar figures are estimates only and may differ from actual outcomes.
6. To the maximum extent permitted by law, we do not warrant that reports are accurate, complete, continuous or fit for a particular purpose beyond the express terms of this contract.

### 4.6 User responsibilities and acceptable use

You must:

- use the Service lawfully and only for authorised purposes;
- ensure inputs you control (tariffs, device selection, date ranges) are accurate to the best of your knowledge;
- maintain confidentiality of customer/system data obtained through the Service;
- ensure you have authority/lawful basis to access end-customer or site data you view or process; and
- comply with the Privacy Policy as a transparency notice (it does not itself grant cookie consent).

You must **not**:

- access data or accounts without authorisation;
- scrape, harvest, bulk-export or misuse Service data except as permitted features allow;
- reverse engineer non-public aspects of the Service except where non-excludable law permits;
- interfere with security, rate limits or authentication;
- upload malware or attempt to probe vulnerabilities except under a documented authorised security programme;
- use the Service to monitor individuals unlawfully, or to collect special category data;
- use analytics or session-replay features to circumvent privacy or employment law obligations; or
- resell, sublicense or misrepresent Sunsynk branding or report content as independent certification.

### 4.7 Credits, pricing, payments and refunds

1. Credits may be required to generate reports. Typically, **one credit** is consumed per **successful** report generation (including regenerate/refresh).
2. Viewing, downloading or deleting an existing report does **not** normally consume credits.
3. Credits are **non-transferable**, not for resale, and have **no cash value** except where a refund is permitted by these Terms or required by law.
4. Payments are processed by **Stripe**. Full card details are not stored in the SSPRS web app.
5. Prices and available bundles may change prospectively. Changes do not affect credits already purchased except as required by law.
6. **Refunds:** Unused credits from a purchase may typically be refunded within **14 days** of that purchase if unused. Used credits are generally **non-refundable**, except where: (a) required by law; (b) the Service was defective in a material way attributable to us; or (c) we agree at our reasonable admin discretion.
7. Bank/card refund timing depends on payment providers and may take several business days.

### 4.8 Administrator and support access

You acknowledge that authorised Sunsynk administrators may search users; view report/credit/purchase/refund history; generate or delete reports for operational reasons; issue refunds; and (super-admins) manage staff roles. Admin actions are logged. This access is described further in the Privacy Policy.

### 4.9 Intellectual property

1. We and our licensors own the Service, software, methodologies, benchmarks, look-and-feel and documentation.
2. Subject to these Terms and payment of applicable credits/fees, we grant you a limited, non-exclusive, non-transferable licence to generate, view, download and use reports for your internal business purposes (or personal purposes if you are an authorised consumer user) related to systems you are authorised to access.
3. You must not remove proprietary notices or use Sunsynk marks except as appearing on generated reports or with prior written permission.
4. You retain your rights in data you lawfully provide; you grant us a licence to process that data to operate the Service.

### 4.10 Confidentiality

You must keep confidential any end-customer, site, device, telemetry and report information obtained through the Service, and use it only for authorised purposes. This does not limit disclosures required by law.

### 4.11 Privacy and cookies (cross-reference)

1. Our Privacy Policy explains how we process personal data.
2. Our Cookie Policy and in-app preference centre govern cookies and similar technologies.
3. **Acceptance of these Terms or the Privacy Policy does not constitute consent to optional cookies, analytics or session replay.** Optional technologies require separate PECR consent.
4. You must not disable or circumvent consent mechanisms.

### 4.12 Third-party services

The Service interoperates with third parties including Firebase authentication, Stripe, and (if consented) analytics/monitoring vendors. Their terms and privacy notices may also apply to their independent processing. We are not responsible for third-party outages beyond our reasonable control, subject to non-excludable duties.

### 4.13 Availability and modifications

We may modify, suspend or discontinue features. We do not guarantee uninterrupted availability. We will use reasonable efforts to avoid unnecessary disruption to paying users.

### 4.14 Suspension and termination

We may suspend or terminate access immediately if you breach these Terms, pose a security risk, lack authorisation, or if required by law. You may stop using the Service at any time. Provisions that by nature should survive (IP, confidentiality, liability, indemnity, governing law) survive termination. Unused credits on termination for your breach are forfeited except where law requires otherwise.

### 4.15 Warranties and disclaimers

Except as expressly stated and except for non-excludable warranties, the Service and reports are provided **“as is”** and **“as available”**. We disclaim implied warranties of merchantability, satisfactory quality and fitness for a particular purpose to the maximum extent permitted by law.

### 4.16 Limitation of liability

**Nothing in these Terms excludes or limits liability for:** death or personal injury caused by negligence; fraud or fraudulent misrepresentation; or any other liability that cannot be excluded under English law (including mandatory consumer rights where applicable).

**Subject to the above, and to the maximum extent permitted by law:**

1. We are not liable for indirect, incidental, special, consequential or punitive loss; loss of profits, revenue, business, goodwill, or anticipated savings; or loss or corruption of data, except to the extent caused by our failure to use reasonable security measures where such failure is not otherwise excluded.
2. Our total aggregate liability arising out of or in connection with the Service in any rolling **12-month** period is limited to the **total fees you paid to us for SSPRS credits/fees in that 12-month period** (or, if greater and solely for a consumer, such minimum as mandatory law requires).
3. If you have paid no fees in that period, our aggregate liability is limited to **£100**, except where mandatory law requires otherwise.

### 4.17 Indemnity (business users)

If you use the Service in a business capacity, you must indemnify Sunsynk and its officers, employees and agents against reasonable losses, damages, costs and expenses (including reasonable legal fees) arising from: (a) your unauthorised access to or disclosure of end-customer/site data; (b) your breach of these Terms; or (c) your misuse of reports or branding, except to the extent caused by our negligence or wilful misconduct.

### 4.18 Force majeure

We are not liable for delay or failure caused by events beyond our reasonable control, including utility/cloud provider outages, denial-of-service attacks, epidemics, industrial disputes, or governmental action.

### 4.19 Export controls and sanctions

You must not use the Service in breach of applicable export control or sanctions laws.

### 4.20 Changes requiring re-acceptance

We may update these Terms. For **material** changes, we may require you to accept the new version (versioned acceptance with timestamp) before continued use. If you do not accept, you must stop using the Service; unused credits will be handled in accordance with refund rules and applicable law.

### 4.21 Notices

Notices to Sunsynk: support@sunsynk.com (contract) or privacy@sunsynk.com (privacy). Notices to you may be sent to your account email or displayed in-app.

### 4.22 Governing law and jurisdiction

These Terms are governed by the laws of **England and Wales**. The courts of England and Wales have exclusive jurisdiction, subject to mandatory local consumer jurisdiction/venue rights where applicable.

### 4.23 General

Entire agreement (excluding fraud); severability; no waiver; no third-party rights under the Contracts (Rights of Third Parties) Act 1999 except as expressly stated; assignment by us to an affiliate or successor; you may not assign without our prior written consent (not to be unreasonably withheld for corporate reorganisation).

### 4.24 Contact

**Sunsynk Limited**  
Unit 10 Edison Court, Ellice Way, Wrexham Technology Park, Wrexham, LL13 7YT, United Kingdom  
support@sunsynk.com

---

## 5. Cookie Policy v1.0

**Version:** 1.0  
**Effective date:** 27 July 2026  
**Related:** Privacy Policy v3.0  

### 5.1 What this Policy covers

This Cookie Policy explains how Sunsynk Limited uses cookies and similar technologies (local storage, pixels, SDKs, tags) on the Service and related sites, and how PECR applies.

### 5.2 PECR in plain legal English

Under the Privacy and Electronic Communications Regulations 2003, we must obtain **prior consent** before storing or accessing information on your device, unless the technology is **strictly necessary** to provide a service you have requested (for example, authentication or security).

Consent must be freely given, specific, informed and unambiguous. Pre-ticked optional boxes are not valid. You must be able to reject non-essential technologies as easily as you accept them. Withdrawing consent must be as easy as giving it.

**Accepting our Terms or Privacy Policy does not equal consent to optional cookies or analytics.**

### 5.3 Categories used by SSPRS

| Category | Examples | Can you refuse? |
|---|---|---|
| Strictly necessary | Auth/session/security, load balancing, consent preference storage, core app function | No: required to use the Service |
| Analytics | Google Analytics 4 (GA4) | Yes |
| Session replay | Microsoft Clarity | Yes |
| Diagnostics / error monitoring | Sentry (when configured) | Yes |
| Product analytics | PostHog analytics (when configured) | Yes |
| Product session replay | PostHog replay (when configured) | Yes |

### 5.4 What happens if you choose “Reject non-essential”

Strictly necessary technologies continue. GA4, Clarity, Sentry and PostHog (and equivalent optional SDKs) must **not** load or set non-essential cookies. Core reporting features remain available.

### 5.5 How to change preferences

- Cookie banner on first visit (and when consent version changes).
- Footer **Cookie settings** / **Manage cookies**.
- In-app: **Settings → Privacy and cookies** (when signed in; preferences may sync to your account).

Browser controls can also block cookies, but may break necessary functions and do not replace our preference centre for category-level consent.

### 5.6 Vendor links (informational)

- Google Analytics: https://policies.google.com/privacy  
- Microsoft Clarity: https://privacy.microsoft.com/privacystatement  
- Stripe (payments; not an optional analytics cookie category): https://stripe.com/privacy  
- Firebase / Google: https://firebase.google.com/support/privacy  
- Sentry: https://sentry.io/privacy/ **[if enabled]**  
- PostHog: https://posthog.com/privacy **[if enabled]**

### 5.7 Cookie / SDK schedule

Exact cookie names, durations and hosts must be completed by engineering in Section 9. Until completed, treat the category descriptions above as controlling for consent UX.

### 5.8 Changes

If we add categories/vendors or materially change optional technologies, we will update this Policy and may require **fresh consent** (consent version bump).

---

## 6. Cookie banner and preference-centre copy

### 6.1 First-visit banner (equal prominence)

**Title (optional):** Cookies and similar technologies  

**Body:**  
We use strictly necessary cookies to run and secure this service. With your permission, we would also like to use optional analytics and session-replay technologies to understand how the service is used. These may process identifiers and on-screen content. You can accept all, reject non-essential, or manage preferences. Accepting our Terms or Privacy Policy does not turn on optional cookies.  
Read our [Cookie Policy](/cookie-policy/) and [Privacy Policy](/privacy-policy/).

**Buttons (equal prominence; reject not visually de-emphasised):**  
1. **Reject non-essential**  
2. **Manage preferences**  
3. **Accept all**

### 6.2 Preference centre

**Title:** Cookie preferences  

**Intro:**  
Choose which optional technologies to allow. Strictly necessary cookies are always on. Optional categories are off until you enable them. No optional boxes are pre-ticked.

**Toggles:**

1. **Strictly necessary**: Always on. Authentication, security, consent storage and core functionality.  
2. **Analytics (GA4)**: Usage statistics and product events. May include device or transaction identifiers. Off by default.  
3. **Session replay (Microsoft Clarity)**: Session recordings, heatmaps and interaction data; may capture on-screen content. Off by default.  
4. **Error monitoring (Sentry)**: Diagnostic error reporting when configured. Off by default.  
5. **Product analytics (PostHog)**: Product usage analytics when configured. Off by default.  
6. **Product session replay (PostHog)**: Product session recordings when configured. Off by default.

**Actions:**  
- Reject non-essential  
- Save preferences  
- Accept all  

**Footer note:** You can change these settings later via Cookie settings. Withdrawal stops further collection for that category; it may not erase data already collected (see Privacy Policy rights).

### 6.3 Short confirmations

- **Saved:** Your cookie preferences have been saved.  
- **Rejected:** Non-essential cookies are off. You can change this anytime in Cookie settings.

---

## 7. Controller / processor matrix

| Scenario / party | Role characterisation | Notes / documents needed |
|---|---|---|
| Sunsynk Limited: SSPRS accounts, billing, consent records, audit logs, admin tools | **Controller** | Core SSPRS controller |
| Sunsynk Limited: report content stored in SSPRS for authorised users | **Controller** (of user account-linked processing); may also process end-customer data on documented instructions or as co/independent controller depending on facts | Clarify per installer contracts **[TO CONFIRM]** |
| Installer / partner generating reports containing end-customer/site data | Typically **independent controller** (or separate controller) of end-customer relationship data; must have own lawful basis/authority | Business-user Terms warranty |
| End customer (homeowner) not using SSPRS directly | Not a Service user; may be data subject of telemetry/report data | Transparency via installer/Sunsynk ecosystem notices **[TO CONFIRM]** |
| Firebase Authentication / Google Cloud hosting components | **Processor** to Sunsynk for auth/hosting **if** DPA applies; Google may be independent controller for some Google account/security telemetry | Execute/verify DPA + transfer tool **[TO CONFIRM]** |
| Stripe | **Independent controller** for much payment processing; Sunsynk controller of SSPRS payment references/credit records; Stripe may also be processor for specific elements per Stripe terms | Follow Stripe Services Agreement / DPA |
| Google Analytics 4 | Often **independent controller** (or joint controller for some configurations) for Google’s own purposes; Sunsynk controller for configuring tags/events. Do **not** assume “processor only” without reviewing Google Measurement Controller-Controller terms / Ads Data Terms | Configure ads features off; review terms **[TO CONFIRM]** |
| Microsoft Clarity | Microsoft may act as **processor** under Microsoft products DPA for Clarity **or** have independent purposes: **verify current Clarity DPA terms**. Sunsynk remains controller for deciding to deploy Clarity and for consent | Execute/verify DPA; masking controls |
| Sentry | Typically **processor** under Sentry DPA when enabled | Enable only with DPA + consent category |
| PostHog | Typically **processor** under PostHog DPA when self-hosted or under customer DPA; verify SaaS terms | Enable only with DPA + consent; consider EU/US hosting choice |

**Public policy language rule:** Match the characterisation above; where status is unconfirmed, say “provider may act as processor or independent controller depending on the service terms” rather than asserting processor status.

---

## 8. Retention schedule

| Data category | Retention period / criterion | Disposition |
|---|---|---|
| Account identity & roles | Life of account + up to 24 months after deactivation | Delete or irreversibly anonymise, subject to legal holds |
| Firebase auth identifiers | As above / per auth provider account lifecycle | Align with account closure runbook **[TO CONFIRM]** |
| Device/site authorisation mappings | Life of authorisation + 12 months | Remove when access ends |
| Telemetry queried for reports | Per source system policies; SSPRS stores derived report inputs as needed | Minimise local copies |
| Generated reports / PDFs / history | 24 months from creation or last access, or earlier deletion by user/admin **[TO CONFIRM operational backup]** | Hard delete from primary store; backups expire on backup cycle |
| Credit balances | Life of account | Zeroed on closure after refunds resolved |
| Stripe references & purchase history | 7 years | Archive then delete |
| Refund decisions | 7 years | Archive then delete |
| Support communications | 24 months after ticket closure | Delete/anonymise |
| Security logs | 12 months | Delete |
| Admin audit logs | 24 months | Delete |
| Cookie consent records (version, timestamp, categories, source) | Minimum 24 months | Retain as compliance evidence |
| GA4 data | Configure ≤ 14 months (prefer 2-13 months) **[TO CONFIRM]** | Vendor purge |
| Clarity recordings | Configure ≤ 3-13 months; prefer shortest workable **[TO CONFIRM]** | Vendor purge; restrict access |
| Sentry events | ≤ 90 days default target **[TO CONFIRM]** | Vendor purge |
| PostHog analytics/replay | Align to ≤ 12 months **[TO CONFIRM]** | Vendor purge |

---

## 9. Cookie / technology schedule template

*Engineering must complete exact values before asserting them as final in the public Cookie Policy.*

| Name | Provider | Purpose | Type (cookie / local storage / SDK) | Duration | Category | Domain / host | First / third party |
|---|---|---|---|---|---|---|---|
| `srp_cookie_consent` / equivalent | Sunsynk | Store consent version & categories | localStorage / cookie | **[TO CONFIRM]** | Strictly necessary | First-party | First |
| Auth session cookie(s) | Firebase / Sunsynk | Authenticated session | cookie | **[TO CONFIRM]** | Strictly necessary | **[TO CONFIRM]** | First / third |
| CSRF / security | Sunsynk | Security | cookie | Session / **[TO CONFIRM]** | Strictly necessary | First-party | First |
| `_ga` / `_ga_*` | Google | GA4 analytics | cookie | up to ~2 years typical | Analytics | **[TO CONFIRM]** | Third |
| Clarity cookies (e.g. `_clck`, `_clsk`) | Microsoft | Session replay / analytics | cookie | **[TO CONFIRM]** | Session replay | **[TO CONFIRM]** | Third |
| Sentry SDK storage | Sentry | Error monitoring | SDK / cookie | **[TO CONFIRM]** | Diagnostics | **[TO CONFIRM]** | Third |
| PostHog cookies | PostHog | Product analytics / replay | cookie / SDK | **[TO CONFIRM]** | Product analytics / Product session replay | **[TO CONFIRM]** | Third |

---

## 10. Analytics technology legal analysis

### 10.1 Strictly necessary session / auth cookies

1. **Nature:** Session and security storage needed to authenticate and operate the Service.  
2. **Personal data:** Yes (session linked to account).  
3. **Roles:** Sunsynk controller; auth/hosting provider typically processor (verify DPA).  
4. **GDPR basis:** Contract / legitimate interests (security).  
5. **PECR:** Necessary exception may apply for requested service.  
6. **Consent quality:** N/A for necessary; still disclose.  
7-15. Retention per schedule; no advertising use; children 18+; not ADM under Art. 22.

### 10.2 Google Analytics 4

1. **Nature:** JS tag/SDK; cookies; events including custom SSPRS events.  
2. **Personal data:** Yes: online identifiers, approximate geo from IP, device IDs in custom events, Stripe session IDs, usage patterns.  
3. **Roles:** Sunsynk controller for deployment; Google often independent controller for Google’s purposes: **verify Measurement terms**.  
4. **GDPR basis:** Consent (Art. 6(1)(a)).  
5. **PECR:** Prior consent required. Legitimate interests **cannot** replace PECR consent.  
6. **Consent:** Granular analytics toggle; withdrawable; scripts must not load pre-consent; on withdraw, disable tag and cease new collection.  
7. **Special risks:** Identifier-rich custom events (`report_generated`, `credit_purchase`, `admin_*`, etc.).  
8. **Minimisation:** Disable Google Signals/ads personalisation; IP anonymisation/redaction where available; no email/Firebase UID/names; shorten retention; limit admin access to GA property.  
9. **Transfers:** Likely USA: need SCC/IDTA/adequacy pathway **[TO CONFIRM]**.  
10. **Retention:** Vendor property settings + Sunsynk event design.  
11. **Rights:** Access/erasure may be limited for pseudonymous hits; document feasibility.  
12. **Children:** Service 18+.  
13. **ADM:** Events are analytics, not Art. 22 decisions.  
14. **Cookie table:** Engineering to complete.  
15. **DPIA:** Include device-ID events and purchase events.

### 10.3 Microsoft Clarity (session replay)

1. **Nature:** Session recording, heatmaps, pointer/scroll capture, performance timing.  
2. **Personal data:** Yes: recordings of user interactions and on-screen content can identify users and reveal customer/site data.  
3. **Roles:** Sunsynk controller; Microsoft role per Clarity DPA/terms **[TO CONFIRM]**.  
4. **GDPR basis:** Consent.  
5. **PECR:** Prior consent mandatory.  
6. **Consent:** Separate **session replay** toggle; withdrawal stops new recordings.  
7. **Special risks:** On-screen PII; keystroke/form capture; passwords/payment fields; covert monitoring / fairness; DPIA threshold for systematic monitoring likely met.  
8. **Minimisation:** Mask inputs; suppress sensitive pages (auth, checkout, admin PII views); restrict who can watch recordings; short retention; user warning in Cookie Policy.  
9. **Transfers:** Likely outside UK/EEA: transfer tool **[TO CONFIRM]**.  
10. **Retention:** Configure short window.  
11. **Rights:** Provide access to recordings where identifiable; erasure via vendor tools where feasible.  
12-13. As above.  
14-15. High residual risk until masking + DPIA + access controls evidenced.

### 10.4 Sentry (when configured)

Diagnostics/error monitoring; may include IP, user agent, release, breadcrumbs, and (if misconfigured) user content. Treat optional cookies/SDK as **consent + PECR**. Minimise PII in events; scrub headers; DPA required.

### 10.5 PostHog analytics / PostHog replay (when configured)

Same structure as GA4 / Clarity respectively. Keep **separate toggles**. Prefer EU hosting if offered. DPA + transfer assessment required before enablement. Replay inherits Clarity-like high-risk profile.

---

## 11. Open questions / facts still needed

1. Has a DPO or named privacy lead been appointed?  
2. Exact hosting regions for SSPRS application database and file storage?  
3. Executed DPAs / SCCs / UK IDTA (or Addendum) status for Firebase/Google Cloud, Stripe, Google Analytics, Microsoft Clarity, Sentry, PostHog?  
4. Is Google Signals / Ads features disabled in GA4?  
5. Exact GA4 measurement ID and cookie list in production?  
6. Clarity project masking rules, excluded pages, and retention setting?  
7. Are Sentry and PostHog live, planned, or only consent-model placeholders?  
8. Operational retention for reports (24 months OK?) and backup TTL?  
9. Is consent preference sync to account already production-ready?  
10. Contractual position with installers regarding end-customer data (processor vs independent controller)?  
11. Any EEA establishment or representative appointment needed?  
12. Are credits stated as non-expiring in commercial policy, or do they expire? (Prior marketing terms said non-expiring; confirm.)  
13. Liability cap currency/amount for zero-fee users: confirm £100 is commercially acceptable.  
14. Penetration testing / security audit claims: confirm what can be truthfully stated.

---

## 12. Implementation checklist

### Product / engineering

- [ ] Gate GA4, Clarity, Sentry, PostHog behind category-specific consent (no pre-consent network calls).  
- [ ] Banner: Accept all / Reject non-essential / Manage preferences with equal prominence; no pre-ticked optional toggles.  
- [ ] Separate toggles for analytics, session replay, diagnostics, product analytics, product session replay.  
- [ ] Bump `CONSENT_VERSION` on material vendor/category changes and re-prompt.  
- [ ] Persist consent evidence: version, timestamp, categories, source; sync when signed in.  
- [ ] On reject/withdraw: remove/disable tags; clear optional cookies where feasible.  
- [ ] Clarity/PostHog: mask inputs; block password/payment fields; exclude auth, checkout, sensitive admin routes.  
- [ ] GA4: strip email, Firebase UID, names; review custom events for minimisation; disable advertising/Signals.  
- [ ] Configure vendor retention caps.  
- [ ] Restrict staff access to recordings; log access where possible.  
- [ ] Ensure Terms/Privacy acceptance modal does **not** enable optional analytics.  
- [ ] Versioned forced re-acceptance for material Terms/Privacy updates.  
- [ ] Complete cookie schedule with real names/durations and publish.  
- [ ] Verify international transfer documentation per vendor.  
- [ ] Complete DPIA for Clarity + identifier-rich GA4 events.  

### Legal / compliance

- [ ] Solicitor review of v3.0 suite.  
- [ ] Confirm all **[TO CONFIRM]** items.  
- [ ] Update installer/partner agreements on end-customer data roles.  
- [ ] Record of processing activities (ROPA) update.  
- [ ] Subprocessor list process for material changes.

---

## 13. Change log and versioning clause

### 13.1 Suite change log

| Version | Effective date | Summary |
|---|---|---|
| Privacy / Terms 2.0 | 19 June 2026 | Prior product baseline (PECR/analytics inconsistency and thinner vendor disclosure). |
| Privacy 3.0 / Terms 3.0 / Cookie 1.0 | 27 July 2026 | Full PECR separation; Clarity/GA4/Sentry/PostHog transparency; admin access; credits/refunds; retention schedule; transfer honesty; stronger liability/non-reliance. |

### 13.2 Operative versioning clause (for in-app use)

> We publish version numbers and effective dates for the Terms, Privacy Policy and Cookie Policy. Material updates to the Terms or Privacy Policy require your affirmative acceptance of the new version before you continue to use the Service. We store the accepted version identifier and timestamp with your account.  
>  
> Optional cookie and similar technologies are controlled by a separate consent record with its own consent version. A material change to cookie categories or vendors will reset or re-prompt cookie preferences.  
>  
> Acceptance of the Terms or Privacy Policy does not itself enable optional analytics, session replay, diagnostics or product analytics technologies.

---

*End of SSPRS Legal Policy Suite v3.0: for solicitor review and implementation.*
