"""Typographic project archive placeholders, explicitly not client deliverables."""
from pathlib import Path
import math

OUT=Path(__file__).resolve().parents[1]/'public'/'images'

def cover(filename, color, accent, headline, subtitle, category, art):
    words=''.join(f'<text x="65" y="{510+i*85}" font-size="88" letter-spacing="-5">{w}</text>' for i,w in enumerate(headline))
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="760" viewBox="0 0 1000 760">
    <defs><radialGradient id="bg" cx=".8" cy=".3" r=".9"><stop stop-color="{accent}" stop-opacity=".25"/><stop offset="1" stop-color="{color}"/></radialGradient><linearGradient id="stroke" x2="1" y2="1"><stop stop-color="{accent}" stop-opacity=".9"/><stop offset="1" stop-color="{accent}" stop-opacity=".08"/></linearGradient></defs>
    <rect width="1000" height="760" fill="{color}"/><rect width="1000" height="760" fill="url(#bg)"/>
    <g stroke="{accent}" opacity=".12" fill="none"><path d="M40 120h920M40 660h920M500 40v680"/><path d="M40 40h920v680H40Z"/></g>
    {art}
    <g font-family="Arial,Helvetica,'Microsoft YaHei',sans-serif" fill="{accent}"><text x="65" y="85" font-size="11" letter-spacing="2.5">HE GANZHONG / {category}</text><g fill="#e8edf5">{words}</g><text x="68" y="635" font-size="19" letter-spacing="3">{subtitle}</text><text x="65" y="701" font-size="9" letter-spacing="2">PROJECT ARCHIVE / PLACEHOLDER COVER</text></g></svg>'''
    (OUT/filename).write_text(svg,encoding='utf-8')

route='''<g fill="none" stroke="url(#stroke)"><ellipse cx="630" cy="305" rx="270" ry="130" transform="rotate(-27 630 305)" stroke-width="1.4"/><ellipse cx="630" cy="305" rx="246" ry="104" transform="rotate(-27 630 305)"/><path d="M200 390Q550 20 900 240" stroke-width="2" stroke-dasharray="5 8"/><circle cx="390" cy="222" r="6" fill="#abc9f7"/><circle cx="878" cy="228" r="6" fill="#abc9f7"/><path d="m870 205 15 22-28 4" stroke-width="2"/></g><text x="745" y="340" fill="#abc9f7" font-family="Arial" font-size="9" letter-spacing="2">VISION IN FLIGHT.</text>'''
cover('aviation-archive.svg','#15202e','#a7c9f6',['BEYOND','THE HORIZON.'],'东方航空 / 品牌宣传','BRAND FILM',route)

ripples=''.join(f'<ellipse cx="{630+i*3}" cy="280" rx="{70+i*12}" ry="{120+i*3}" transform="rotate(32 {630+i*3} 280)" stroke="url(#stroke)" stroke-width="1.3" fill="none"/>' for i in range(15))
cover('product-archive.svg','#27201c','#e4ae81',['PRODUCT','IN MOTION.'],'康夫吹风机 / 商业广告','PRODUCT COMMERCIAL',ripples)

rings='''<g fill="none" stroke="url(#stroke)"><circle cx="610" cy="270" r="143" stroke-width="1.8"/><circle cx="740" cy="270" r="143" stroke-width="1.8"/><circle cx="610" cy="270" r="132"/><circle cx="740" cy="270" r="132"/><path d="M672 72v397M455 270h438" opacity=".3"/></g><path d="m674 158 5 16 16 5-16 5-5 16-5-16-16-5 16-5Z" fill="#dfbac0"/>'''
cover('wedding-archive.svg','#2a1c27','#dab8c7',['TOGETHER,','REIMAGINED.'],'AI 婚礼 / 宣传影像','AI WEDDING FILM',rings)

frames=''.join(f'<g transform="translate({480+i*48} {115+i*20}) rotate({-20+i*8} 140 100)"><rect width="285" height="210" rx="3" fill="#1e2038" stroke="#b4ace4" stroke-opacity="{.18+i*.17}"/><path d="M14 14h257v182H14Z" fill="none" stroke="#b4ace4" stroke-opacity=".15"/><path d="m122 81 43 25-43 25Z" fill="none" stroke="#b4ace4" stroke-opacity=".55"/></g>' for i in range(4))
cover('narrative-archive.svg','#181c2c','#b4ace4',['STORIES','BEYOND REALITY.'],'短剧与游戏 / AI 视觉内容','AI NARRATIVE &amp; VFX',frames)
print('Generated four clearly labeled project archive covers.')
