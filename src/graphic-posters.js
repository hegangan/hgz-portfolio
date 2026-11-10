import {publicAsset} from './site-assets';

const posters = [
  ['changzhi', ['长治博物馆 · 城市文化海报', 'Changzhi Museum · Cultural Poster'], ['城市文化 / 字体与版式', 'CULTURE / TYPOGRAPHY'], 3508, 4961],
  ['fearless', ['无惧 · 字体与版式', 'Fearless · Typographic Poster'], ['字体设计 / 视觉表达', 'TYPE / VISUAL EXPRESSION'], 2480, 3508],
  ['just-do-it', ['JUST DO IT · 人物视觉海报', 'Just Do It · Portrait Poster'], ['人物视觉 / 运动主题', 'PORTRAITS / SPORTS'], 2480, 3508],
  ['tea-culture', ['茶文化 · 东方视觉', 'Tea Culture · Eastern Aesthetics'], ['传统文化 / 图文设计', 'CULTURE / EDITORIAL'], 2000, 2000],
  ['jbl-editorial', ['JBL · 编辑版式', 'JBL · Editorial Layout'], ['产品主题 / 编辑版式', 'PRODUCT / EDITORIAL'], 3508, 4961],
  ['digital-era', ['数字时代 · 讲座海报', 'The Digital Era · Event Poster'], ['活动海报 / 数字视觉', 'EVENT / DIGITAL VISUALS'], 2480, 3508],
];

export function getGraphicPosters(language) {
  const index = language === 'en' ? 1 : 0;
  return posters.map(([id, title, discipline, width, height]) => ({
    id, title: title[index], discipline: discipline[index], width, height,
    coverImage: publicAsset(`/images/graphic-posters/${id}.webp`),
    image: publicAsset(`/images/graphic-posters/${id}.webp`),
    original: publicAsset(`/images/graphic-posters/${id}.jpg`),
  }));
}
