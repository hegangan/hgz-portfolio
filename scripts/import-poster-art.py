"""Import approved poster designs as web assets without changing their composition."""
from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'exports/cinematic-posters-final'
OUT = ROOT / 'public/images/posters'
OUT.mkdir(parents=True, exist_ok=True)
manifest = json.loads((SOURCE / 'manifest.json').read_text(encoding='utf-8'))
result = {}
for item in manifest:
    image = Image.open(SOURCE / item['file']).convert('RGB')
    assert image.size == (1024, 1536), item['id']
    destination = OUT / (item['id'] + '.webp')
    image = image.resize((800, 1200), Image.Resampling.LANCZOS)
    image.save(destination, 'WEBP', quality=72, method=6)
    result[item['id']] = {
        'src': '/images/posters/' + destination.name,
        'width': 800,
        'height': 1200,
        'title': item['title'],
    }
(ROOT / 'src/poster-assets.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(result)} posters, {sum(p.stat().st_size for p in OUT.glob("*.webp")):,} bytes.')
