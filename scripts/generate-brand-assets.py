#!/usr/bin/env python3
"""Generate assets/images/og-image.jpg, twitter-image.jpg, and apple-touch-icon.png."""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "images"

BLUE = "#1e5eff"
BLUE_DARK = "#0d3a9c"
GOLD = "#e8a800"
GOLD_DARK = "#c48a00"
SLATE_50 = "#f4f7fb"
SLATE_100 = "#e8eef6"
SLATE_200 = "#d5deed"
SLATE_600 = "#3d5370"
SLATE_800 = "#1b2e46"
SLATE_900 = "#0d1c2e"
WHITE = "#ffffff"
GREEN = "#17ba6b"
ORANGE = "#f97316"


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def vertical_gradient(size: tuple[int, int], top: str, bottom: str) -> Image.Image:
    w, h = size
    top_rgb = tuple(int(top[i : i + 2], 16) for i in (1, 3, 5))
    bottom_rgb = tuple(int(bottom[i : i + 2], 16) for i in (1, 3, 5))
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        color = tuple(lerp(top_rgb[i], bottom_rgb[i], t) for i in range(3))
        for x in range(w):
            px[x, y] = color
    return img


def paste_rgba(base: Image.Image, overlay: Image.Image, xy: tuple[int, int]) -> None:
    if overlay.mode != "RGBA":
        overlay = overlay.convert("RGBA")
    base.paste(overlay, xy, overlay)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textlength(trial, font=font) <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def draw_score_ring(draw: ImageDraw.ImageDraw, cx: int, cy: int, radius: int, score: int) -> None:
    bbox = [cx - radius, cy - radius, cx + radius, cy + radius]
    draw.arc(bbox, 135, 405, fill=SLATE_100, width=16)
    progress = score / 100
    end_angle = 135 + 270 * progress
    draw.arc(bbox, 135, end_angle, fill=BLUE, width=16)
    if progress > 0.45:
        mid = 135 + 270 * 0.45
        draw.arc(bbox, mid, min(end_angle, 135 + 270 * 0.72), fill=GOLD, width=16)
    score_font = load_font(42, bold=True)
    sub_font = load_font(16)
    draw.text((cx, cy - 14), str(score), fill=SLATE_900, font=score_font, anchor="mm")
    draw.text((cx, cy + 18), "/ 100", fill=SLATE_600, font=sub_font, anchor="mm")


def generate_og_image() -> Image.Image:
    w, h = 1200, 630
    img = vertical_gradient((w, h), SLATE_50, WHITE)
    draw = ImageDraw.Draw(img)

    # Soft brand glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((720, -80, 1180, 380), fill=(30, 94, 255, 28))
    glow_draw.ellipse((-60, 360, 360, 700), fill=(232, 168, 0, 18))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Left copy block
    logo = Image.open(ASSETS / "sunsynk-logo.png").convert("RGBA")
    logo_w = 300
    logo_h = int(logo.height * (logo_w / logo.width))
    logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    paste_rgba(img, logo, (72, 74))

    draw.rounded_rectangle((72, 74 + logo_h + 22, 132, 74 + logo_h + 26), radius=2, fill=GOLD)

    title_font = load_font(40, bold=True)
    sub_font = load_font(24, bold=True)
    body_font = load_font(19)
    meta_font = load_font(17, bold=True)

    y = 74 + logo_h + 44
    draw.text((72, y), "Sunsynk Report Platform", fill=SLATE_900, font=title_font)
    y += 54

    for line in wrap_text(
        draw,
        "30-day performance reports for your Sunsynk solar and battery system",
        sub_font,
        520,
    ):
        draw.text((72, y), line, fill=SLATE_800, font=sub_font)
        y += 34

    y += 8
    for line in wrap_text(
        draw,
        "Executive overview, optional savings, system health, and prioritised actions in one PDF.",
        body_font,
        520,
    ):
        draw.text((72, y), line, fill=SLATE_600, font=body_font)
        y += 28

    y += 10
    draw.text((72, y), "From £2.99  ·  Credits never expire  ·  No subscription", fill=GOLD_DARK, font=meta_font)

    # Right preview card
    card_x, card_y, card_w, card_h = 640, 72, 488, 486
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (card_x + 6, card_y + 10, card_x + card_w + 6, card_y + card_h + 10),
        radius=16,
        fill=(13, 28, 46, 36),
    )
    img = Image.alpha_composite(img.convert("RGBA"), shadow).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle((card_x, card_y, card_x + card_w, card_y + card_h), radius=16, fill=WHITE, outline=SLATE_200, width=2)
    draw.rectangle((card_x, card_y, card_x + card_w, card_y + 48), fill=SLATE_50)
    draw.line((card_x, card_y + 48, card_x + card_w, card_y + 48), fill=SLATE_200, width=1)
    bar_font = load_font(15, bold=True)
    draw.text((card_x + 22, card_y + 24), "Executive summary", fill=SLATE_800, font=bar_font, anchor="lm")

    draw.text((card_x + card_w - 22, card_y + 24), "30-day window", fill=SLATE_600, font=load_font(13), anchor="rm")

    ring_cx = card_x + card_w // 2
    ring_cy = card_y + 188
    draw_score_ring(draw, ring_cx, ring_cy, 78, 52)

    pill_font = load_font(14, bold=True)
    pill_w, pill_h = 168, 34
    pill_x = ring_cx - pill_w // 2
    pill_y = ring_cy + 98
    draw.rounded_rectangle((pill_x, pill_y, pill_x + pill_w, pill_y + pill_h), radius=17, fill="#fff6db", outline=GOLD, width=1)
    draw.text((ring_cx, pill_y + 17), "Needs attention", fill=GOLD_DARK, font=pill_font, anchor="mm")

    issue_font = load_font(16)
    for i, line in enumerate(
        wrap_text(draw, "Evening battery cover runs short before demand settles", issue_font, card_w - 56)
    ):
        draw.text((card_x + 28, pill_y + 58 + i * 24), line, fill=SLATE_600, font=issue_font)

    stat_y = card_y + card_h - 118
    stats = [
        ("612 kWh", "Self-supplied"),
        ("£186", "Est. savings"),
        ("98.4%", "Data coverage"),
    ]
    col_w = card_w // 3
    for i, (value, label) in enumerate(stats):
        sx = card_x + i * col_w + col_w // 2
        draw.text((sx, stat_y), value, fill=BLUE_DARK, font=load_font(20, bold=True), anchor="mm")
        draw.text((sx, stat_y + 28), label, fill=SLATE_600, font=load_font(13), anchor="mm")

    footer_font = load_font(14, bold=True)
    draw.text((w // 2, h - 28), "sunsynkreports.com", fill=SLATE_600, font=footer_font, anchor="mm")

    return img


def generate_apple_touch_icon() -> Image.Image:
    size = 180
    img = Image.new("RGBA", (size, size), BLUE)
    draw = ImageDraw.Draw(img)

    # Subtle radial highlight
    for r in range(90, 0, -1):
        t = r / 90
        color = (
            int(30 + (255 - 30) * (1 - t) * 0.08),
            int(94 + (255 - 94) * (1 - t) * 0.08),
            int(255 * (0.92 + 0.08 * t)),
            255,
        )
        draw.ellipse((90 - r, 90 - r, 90 + r, 90 + r), fill=color)

    icon = Image.open(ASSETS / "favicon.ico").convert("RGBA")
    icon_size = 118
    icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    paste_rgba(img, icon, ((size - icon_size) // 2, (size - icon_size) // 2))
    return img


def main() -> None:
    og = generate_og_image()
    og_rgb = og.convert("RGB")
    og_path = ASSETS / "og-image.jpg"
    twitter_path = ASSETS / "twitter-image.jpg"
    og_rgb.save(og_path, "JPEG", quality=90, optimize=True, progressive=True)
    og_rgb.save(twitter_path, "JPEG", quality=90, optimize=True, progressive=True)

    apple = generate_apple_touch_icon()
    apple_path = ASSETS / "apple-touch-icon.png"
    apple.save(apple_path, "PNG", optimize=True)

    print(f"Wrote {og_path} ({og_path.stat().st_size // 1024} KB)")
    print(f"Wrote {twitter_path} ({twitter_path.stat().st_size // 1024} KB)")
    print(f"Wrote {apple_path} ({apple_path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
