# -*- coding: utf-8 -*-
"""Generate favicon set for hutsol.dk: blue rounded square, white H, yellow bar.
Brand colors from site CSS: --blue #1f5fa6, --sun #f5b800."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
BLUE = (31, 95, 166, 255)
SUN = (245, 184, 0, 255)
WHITE = (255, 255, 255, 255)
S = 512


def make_base():
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=S // 5, fill=BLUE)
    font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", int(S * 0.62))
    bbox = d.textbbox((0, 0), "H", font=font)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (S - w) / 2 - bbox[0]
    y = (S - h) / 2 - bbox[1] - S * 0.04
    d.text((x, y), "H", font=font, fill=WHITE)
    bar_w, bar_h = int(S * 0.46), int(S * 0.07)
    bx = (S - bar_w) // 2
    by = int(S * 0.78)
    d.rounded_rectangle([bx, by, bx + bar_w, by + bar_h], radius=bar_h // 2, fill=SUN)
    return img


def main():
    base = make_base()
    base.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png")
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    base.resize((48, 48), Image.LANCZOS).save(OUT / "favicon.ico", sizes=ico_sizes)
    base.resize((192, 192), Image.LANCZOS).save(OUT / "icon-192.png")
    print("OK: favicon.ico, apple-touch-icon.png, icon-192.png ->", OUT)


if __name__ == "__main__":
    main()
