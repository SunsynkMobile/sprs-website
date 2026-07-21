#!/usr/bin/env python3
"""Generate assets/images/og-image.jpg, twitter-image.jpg, and apple-touch-icon.png."""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "images"

BLUE = "#24314a"
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
    draw.arc(bbox, 135, 405, fill=SLATE_100, width=max(12, radius // 5))
    progress = score / 100
    end_angle = 135 + 270 * progress
    draw.arc(bbox, 135, end_angle, fill=BLUE, width=max(12, radius // 5))
    if progress > 0.45:
        mid = 135 + 270 * 0.45
        draw.arc(bbox, mid, min(end_angle, 135 + 270 * 0.72), fill=GOLD, width=max(12, radius // 5))
    score_font = load_font(max(28, radius // 2), bold=True)
    sub_font = load_font(max(12, radius // 5))
    draw.text((cx, cy - radius // 6), str(score), fill=SLATE_900, font=score_font, anchor="mm")
    draw.text((cx, cy + radius // 4), "/ 100", fill=SLATE_600, font=sub_font, anchor="mm")


def text_block_height(lines: list[str], line_height: int) -> int:
    if not lines:
        return 0
    return len(lines) * line_height


def draw_text_lines(
    draw: ImageDraw.ImageDraw,
    lines: list[str],
    x: int,
    y: int,
    font: ImageFont.ImageFont,
    fill: str,
    line_height: int,
    align: str = "left",
    box_width: int | None = None,
) -> int:
    """Draw lines and return the y position after the last line."""
    for i, line in enumerate(lines):
        ly = y + i * line_height
        if align == "center" and box_width is not None:
            draw.text((x + box_width // 2, ly), line, fill=fill, font=font, anchor="ma")
        else:
            draw.text((x, ly), line, fill=fill, font=font)
    return y + text_block_height(lines, line_height)


def generate_og_image() -> Image.Image:
    scale = 2
    w, h = 1200 * scale, 630 * scale
    img = vertical_gradient((w, h), SLATE_50, WHITE)
    draw = ImageDraw.Draw(img)

    def s(v: int | float) -> int:
        return int(round(v * scale))

    # Soft brand glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((s(720), s(-80), s(1180), s(380)), fill=(30, 94, 255, 28))
    glow_draw.ellipse((s(-60), s(360), s(360), s(700)), fill=(232, 168, 0, 18))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Left copy block
    logo = Image.open(ASSETS / "sunsynk-logo.png").convert("RGBA")
    logo_w = s(300)
    logo_h = int(logo.height * (logo_w / logo.width))
    logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    paste_rgba(img, logo, (s(72), s(74)))

    draw.rounded_rectangle((s(72), s(74) + logo_h + s(22), s(132), s(74) + logo_h + s(26)), radius=s(2), fill=GOLD)

    title_font = load_font(s(40), bold=True)
    sub_font = load_font(s(24), bold=True)
    body_font = load_font(s(19))
    meta_font = load_font(s(17), bold=True)

    y = s(74) + logo_h + s(44)
    draw.text((s(72), y), "Sunsynk Report Platform", fill=SLATE_900, font=title_font)
    y += s(54)

    for line in wrap_text(
        draw,
        "30-day performance reports for your Sunsynk solar and battery system",
        sub_font,
        s(520),
    ):
        draw.text((s(72), y), line, fill=SLATE_800, font=sub_font)
        y += s(34)

    y += s(8)
    for line in wrap_text(
        draw,
        "Executive overview, optional savings, system health, and prioritised actions in one PDF.",
        body_font,
        s(520),
    ):
        draw.text((s(72), y), line, fill=SLATE_600, font=body_font)
        y += s(28)

    y += s(10)
    draw.text((s(72), y), "From £2.99  ·  Credits never expire  ·  No subscription", fill=GOLD_DARK, font=meta_font)

    # Right preview card
    card_x, card_y, card_w, card_h = s(640), s(72), s(488), s(486)
    pad = s(28)
    inner_w = card_w - pad * 2

    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (card_x + s(6), card_y + s(10), card_x + card_w + s(6), card_y + card_h + s(10)),
        radius=s(16),
        fill=(13, 28, 46, 36),
    )
    img = Image.alpha_composite(img.convert("RGBA"), shadow).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle(
        (card_x, card_y, card_x + card_w, card_y + card_h),
        radius=s(16),
        fill=WHITE,
        outline=SLATE_200,
        width=s(2),
    )
    header_h = s(48)
    draw.rectangle((card_x, card_y, card_x + card_w, card_y + header_h), fill=SLATE_50)
    draw.line((card_x, card_y + header_h, card_x + card_w, card_y + header_h), fill=SLATE_200, width=s(1))
    bar_font = load_font(s(15), bold=True)
    draw.text((card_x + pad, card_y + header_h // 2), "Executive summary", fill=SLATE_800, font=bar_font, anchor="lm")
    draw.text((card_x + card_w - pad, card_y + header_h // 2), "30-day window", fill=SLATE_600, font=load_font(s(13)), anchor="rm")

    ring_cx = card_x + card_w // 2
    ring_cy = card_y + header_h + s(118)
    draw_score_ring(draw, ring_cx, ring_cy, s(72), 52)

    pill_font = load_font(s(14), bold=True)
    pill_w, pill_h = s(168), s(34)
    pill_x = ring_cx - pill_w // 2
    pill_y = ring_cy + s(92)
    draw.rounded_rectangle(
        (pill_x, pill_y, pill_x + pill_w, pill_y + pill_h),
        radius=pill_h // 2,
        fill="#fff6db",
        outline=GOLD,
        width=s(1),
    )
    draw.text((ring_cx, pill_y + pill_h // 2), "Needs attention", fill=GOLD_DARK, font=pill_font, anchor="mm")

    issue_font = load_font(s(15))
    issue_line_h = s(22)
    issue_lines = wrap_text(
        draw,
        "Evening battery cover falls short before peak demand",
        issue_font,
        inner_w,
    )
    issue_top = pill_y + pill_h + s(20)
    issue_bottom = draw_text_lines(
        draw,
        issue_lines,
        card_x + pad,
        issue_top,
        issue_font,
        SLATE_600,
        issue_line_h,
        align="center",
        box_width=inner_w,
    )

    # Stats block - always below issue text with clear separation
    stats_top = issue_bottom + s(22)
    draw.line(
        (card_x + pad, stats_top - s(10), card_x + card_w - pad, stats_top - s(10)),
        fill=SLATE_200,
        width=s(1),
    )

    stat_value_font = load_font(s(20), bold=True)
    stat_label_font = load_font(s(13))
    stats = [
        ("612 kWh", "Self-supplied"),
        ("£186", "Est. savings"),
        ("98.4%", "Data coverage"),
    ]
    col_w = inner_w // 3
    value_y = stats_top + s(8)
    for i, (value, label) in enumerate(stats):
        sx = card_x + pad + i * col_w + col_w // 2
        draw.text((sx, value_y), value, fill=BLUE_DARK, font=stat_value_font, anchor="ma")
        draw.text((sx, value_y + s(30)), label, fill=SLATE_600, font=stat_label_font, anchor="ma")

    footer_font = load_font(s(14), bold=True)
    draw.text((w // 2, h - s(28)), "sunsynkreports.com", fill=SLATE_600, font=footer_font, anchor="mm")

    return img.resize((1200, 630), Image.Resampling.LANCZOS)


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
    og_rgb.save(og_path, "JPEG", quality=92, optimize=True, progressive=True, subsampling=0)
    og_rgb.save(twitter_path, "JPEG", quality=92, optimize=True, progressive=True, subsampling=0)

    apple = generate_apple_touch_icon()
    apple_path = ASSETS / "apple-touch-icon.png"
    apple.save(apple_path, "PNG", optimize=True)

    print(f"Wrote {og_path} ({og_path.stat().st_size // 1024} KB)")
    print(f"Wrote {twitter_path} ({twitter_path.stat().st_size // 1024} KB)")
    print(f"Wrote {apple_path} ({apple_path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
