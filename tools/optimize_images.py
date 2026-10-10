"""Select the strongest Golden Hour Loft photos and optimize them for web.

Outputs, per photo:
  <name>.jpg      - max 1920px wide, JPEG q82, progressive
  <name>-sm.jpg   - max 960px wide, JPEG q75, progressive (for srcset)
"""
import os
from PIL import Image, ImageOps

SRC = os.path.expanduser("~/workspace/user/media_library/image")
OUT = os.path.expanduser("~/workspace/ruleofthirds/images")
os.makedirs(OUT, exist_ok=True)

# (source relative path, output base name) — curated: strongest, most varied shots
SELECTIONS = [
    ("28/286e6b53ceeffeddfca3a3ca1a444535b48aa542d17ba5ac6ad005901dce3e38.jpg", "loft-double-height"),  # dramatic vertical, hero
    ("33/3350183c6a6b91c346a29aa78e55a66798a87d897def401e0881b834cecdb342.jpg", "living-staircase"),     # warm styled wide
    ("1f/1f56d68fb543e654fbb41a8a0bdec70bea1fa3013aec2d32391ca19ec97d070f.jpg", "kitchen"),              # kitchen, great light
    ("25/2546b7541ecae83a07e5d6f74293b5889a9868595b7657a7ee5717a2636dc404.jpg", "art-abstract"),        # vibrant art moment
    ("6a/6a1399490cbddfcd3cce5176ff87410f984d9d4000d0f6ab9029a2f6c76113bf.jpg", "art-boxing-gloves"),   # distinctive editorial
    ("5d/5d19d181c894e2b81e917d19c94477baaaf371f0bd4204a22995de7ecc262bc7.jpg", "vinyl-wall"),           # culture vibe
    ("bc/bc31090f6a217ac144ea37733d4d11430ec3557a5b8c080ad92eac1a96bef602.jpg", "lounge-art"),      # bright, airy
    ("a3/a3a86de25a2619451e56f45d10b22159f3a4063727d75bb9970dfca58e7bd776.jpg", "living-wide"),         # classic wide
]

total_before = 0
total_after = 0

for src_rel, name in SELECTIONS:
    src = os.path.join(SRC, src_rel)
    before = os.path.getsize(src)
    total_before += before
    im = ImageOps.exif_transpose(Image.open(src).convert("RGB"))

    # large: max width 1920
    large = im.copy()
    if large.width > 1920:
        large = large.resize((1920, round(1920 * large.height / large.width)), Image.LANCZOS)
    large_path = os.path.join(OUT, f"{name}.jpg")
    large.save(large_path, "JPEG", quality=82, progressive=True, optimize=True)

    # small: max width 960 (for srcset)
    small = im.copy()
    if small.width > 960:
        small = small.resize((960, round(960 * small.height / small.width)), Image.LANCZOS)
    small_path = os.path.join(OUT, f"{name}-sm.jpg")
    small.save(small_path, "JPEG", quality=75, progressive=True, optimize=True)

    after = os.path.getsize(large_path) + os.path.getsize(small_path)
    total_after += after
    print(f"{name}: {before/1e6:.1f}MB -> {after/1e6:.2f}MB  ({large.size[0]}x{large.size[1]})")

print(f"\nTOTAL: {total_before/1e6:.1f}MB -> {total_after/1e6:.2f}MB "
      f"({100*(1-total_after/total_before):.0f}% smaller)")
print(f"Files in {OUT}: {sorted(os.listdir(OUT))}")
