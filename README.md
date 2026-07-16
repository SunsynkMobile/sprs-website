# Sunsynk Report Platform — Website

Marketing site for [sunsynkreports.com](https://sunsynkreports.com/). Static HTML on GitHub Pages.

## Structure

```
/
├── index.html                 # Homepage
├── CNAME                      # Custom domain
├── robots.txt, sitemap.xml    # SEO
├── site.webmanifest           # PWA manifest
├── llms.txt, llms-full.txt    # LLM orientation files
├── privacy-policy.html        # Legacy redirect stubs (→ trailing-slash URLs)
├── terms-of-use.html
├── cookie-policy.html
├── knowledgebase.html
├── privacy-policy/index.html  # Content pages
├── terms-of-use/index.html
├── cookie-policy/index.html
├── knowledgebase/index.html
├── assets/
│   ├── css/                   # styles.css, tokens.css, doc-pages.css
│   ├── js/                    # script.js, cookie-consent.js, doc-pages.js
│   └── images/                # logos, favicon, OG/social images
├── scripts/                   # Build helpers (not served as pages)
│   ├── generate-brand-assets.py
│   └── update-asset-paths.py
└── .well-known/security.txt
```

## Local preview

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

## Regenerate share images & Apple touch icon

```bash
python3 scripts/generate-brand-assets.py
```

Outputs to `assets/images/og-image.jpg`, `twitter-image.jpg`, and `apple-touch-icon.png`.
