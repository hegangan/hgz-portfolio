import {publicAsset} from './site-assets';
import catalog from './video-catalog.json';
import additionalFilms from './additional-films';
import shortFilms from './short-films';
import posterDesigns from './poster-designs.json';
import posterAssets from './poster-assets.json';

export const filmCategories = [
  { id: 'live', zh: '实拍作品', en: 'Live-action Films' },
  { id: 'short', zh: '实拍短视频', en: 'Live-action Shorts' },
  { id: 'vfx', zh: 'AI影视特效', en: 'AI Film VFX' },
  { id: 'all', zh: '全部', en: 'All films' },
  { id: 'drama', zh: 'AI短剧', en: 'AI Short Dramas' },
  { id: 'commercial', zh: '商业广告', en: 'Commercial' },
  { id: 'story', zh: 'AI 叙事', en: 'AI Stories' },
  { id: 'visual', zh: 'CG / 视觉', en: 'CG & Visual' },
  { id: 'reel', zh: '创作合集', en: 'Showreel' },
];

const films = [
  {
    id: 'showreel', category: 'reel', accent: '#adc9fa', style: 'epic',
    title: ['个人能力展示 — 创作精选', 'Creative Showreel'],
    discipline: ['创作合集', 'CREATIVE SHOWREEL'],
    posterTitle: [['想象不设限。', '影像有回响。'], ['IMAGINATION,', 'IN MOTION.']],
    description: ['以一支创作合集，串联运动影像、自然场景、幻想生物与视觉特效。从真实质感到超现实想象，呈现不同类型的镜头表达与影像探索。', 'A selection spanning sports imagery, natural environments, fantasy creatures and visual effects. From believable textures to surreal worlds, this reel brings together a range of visual approaches and cinematic experiments.'],
    tags: [['创作合集', '视觉特效', '多风格影像'], ['Showreel', 'Visual effects', 'Visual exploration']],
  },
  {
    id: 'aviation', category: 'commercial', accent: '#c6d8f0', style: 'editorial',
    title: ['东方航空 — 宠物进舱服务 2.0', 'China Eastern — Pets in Cabin 2.0'],
    discipline: ['航空品牌 / 服务宣传', 'AVIATION / BRAND FILM'],
    posterTitle: [['让陪伴，', '一起起飞。'], ['TOGETHER,', 'ABOVE THE CLOUDS.']],
    description: ['围绕东方航空宠物进舱服务 2.0，以机场、客舱与宠物出行场景展开，串联服务流程与陪伴感，让功能信息融入品牌影像叙事。', 'A service film for China Eastern’s Pets in Cabin 2.0. Airport, cabin and pet-travel scenes connect practical service information with the emotional comfort of travelling together.'],
    tags: [['品牌宣传', '服务叙事', '商业影像'], ['Brand film', 'Service storytelling', 'Commercial imagery']],
  },
  {
    id: 'konfu', category: 'commercial', accent: '#c9b6e5', style: 'minimal',
    title: ['康夫 — 吹风机商业广告', 'CONFU — Hair Dryer Commercial'],
    discipline: ['个护产品 / 商业广告', 'BEAUTY / PRODUCT COMMERCIAL'],
    posterTitle: [['风过，', '自有光泽。'], ['A LIGHTER TOUCH.', 'A BRIGHTER FINISH.']],
    description: ['以日常护理场景为起点，通过人物、产品近景与发丝细节，建立吹风机的使用情境与视觉质感，在生活感和产品表达之间寻找平衡。', 'Everyday hair-care scenes meet product close-ups and detailed hair textures. The film balances a familiar domestic setting with a polished visual presentation of the hair dryer.'],
    tags: [['产品广告', '发丝质感', '生活场景'], ['Product commercial', 'Hair detail', 'Lifestyle imagery']],
  },
  {
    id: 'wait-for-you', category: 'story', accent: '#dec9aa', style: 'cinema',
    title: ['《我等你出警回来》', 'Until You Come Home'],
    discipline: ['情感短片 / 致敬消防英雄', 'EMOTIONAL SHORT / A TRIBUTE TO FIREFIGHTERS'],
    posterTitle: [['我等你', '出警回来'], ['UNTIL YOU', 'COME HOME']],
    description: ['围绕消防员与恋人的约定，将婚礼、消防救援与日常回忆交织，讲述等待、思念与守护。柔和的双人情感叙事与救援场景相互映照，以 AI 影像致敬消防英雄。', 'A promise between a firefighter and his fiancée unfolds through wedding scenes, rescue work and memories of everyday life. Tender character moments contrast with the urgency of rescue in an AI short about waiting, remembrance and devotion, paying tribute to firefighters.'],
    tags: [['情感叙事', '消防题材', 'AI 短片'], ['Emotional storytelling', 'Firefighters', 'AI short film']],
  },
  {
    id: 'wedding-lifetimes', category: 'story', accent: '#edc0cf', style: 'romantic',
    title: ['前世今生 — AI 婚礼影像', 'Across Lifetimes — An AI Wedding Film'],
    discipline: ['爱情叙事 / AI 婚礼', 'ROMANCE / AI WEDDING FILM'],
    posterTitle: [['前世今生，', '仍然是你。'], ['ACROSS LIFETIMES,', 'ALWAYS YOU.']],
    description: ['在现代都市、古风江湖与华丽舞会之间切换，以跨越时空的相遇构成爱情视觉叙事。不同场景与人物造型共同编织一段浪漫的想象。', 'A romantic visual journey across a modern city, historical fantasy and a grand ballroom. Changing worlds and character designs weave together encounters that transcend time.'],
    tags: [['爱情叙事', '跨时空场景', 'AI 影像'], ['Romantic storytelling', 'World building', 'AI film']],
  },
  {
    id: 'ink-cg', category: 'visual', accent: '#9ee2c3', style: 'ink',
    title: ['水墨 CG — 墨境交锋', 'Ink CG — Clash in an Ink World'],
    discipline: ['东方美学 / CG 视觉', 'INK AESTHETICS / CG VISUAL'],
    posterTitle: [['一笔入境，', '万象成形。'], ['INK BECOMES', 'A WORLD.']],
    description: ['以黑白水墨为基底，加入青绿色能量、武侠人物与异兽交锋。笔触、墨流与动态冲击交织，探索东方意象和 CG 视觉的结合。', 'Black-and-white ink textures meet emerald energy, martial-arts figures and mythical creatures. Brush strokes, flowing ink and dynamic action explore the intersection of Eastern imagery and CG aesthetics.'],
    tags: [['水墨风格', '角色动作', '幻想视觉'], ['Ink aesthetics', 'Character action', 'Fantasy visuals']],
  },
  {
    id: 'mother', category: 'story', accent: '#dec9aa', style: 'cinema',
    title: ['《阿尔兹海默症母亲》', 'Mother, Beyond Memory'],
    discipline: ['亲情短片 / AI 叙事', 'FAMILY DRAMA / AI SHORT'],
    posterTitle: [['当记忆走远，', '爱仍然在。'], ['WHEN MEMORY FADES,', 'LOVE REMAINS.']],
    description: ['通过旧居、电话与人物近景，围绕母亲、记忆和亲情展开情感叙事。克制的空间调度与表情细节，让情绪在日常场景中逐渐积累。', 'An emotional short about a mother, memory and family, told through an old home, phone calls and intimate close-ups. Restrained staging and subtle expressions allow the emotion to build within everyday moments.'],
    tags: [['亲情叙事', '人物情绪', '电影感影像'], ['Family storytelling', 'Character emotion', 'Cinematic imagery']],
  },
  {
    id: 'translator', category: 'commercial', accent: '#9bd5f7', style: 'tech',
    title: ['音诺 — AI 翻译器广告', 'Yinnuo — AI Translator Commercial'],
    discipline: ['智能硬件 / 概念广告', 'SMART DEVICE / CONCEPT COMMERCIAL'],
    posterTitle: [['让世界，', '听见彼此。'], ['A WORLD,', 'UNDERSTOOD.']],
    description: ['把 AI 翻译器放入都市科幻、发布会与日常交流场景，以不同世界之间的对话构建概念表达，让智能硬件的沟通主题更具画面想象力。', 'An AI translator moves through urban science fiction, a press event and everyday conversations. Encounters between different worlds turn the idea of communication into a visually imaginative device commercial.'],
    tags: [['智能硬件', '科幻场景', '概念表达'], ['Smart device', 'Science fiction', 'Concept storytelling']],
  },
  {
    id: 'wedding-promo', category: 'story', accent: '#f2d4a2', style: 'romantic',
    title: ['婚礼宣传片 — 云境之约', 'A Promise Above the Clouds — Wedding Film'],
    discipline: ['古风浪漫 / 婚礼宣传', 'FANTASY ROMANCE / WEDDING PROMO'],
    posterTitle: [['把浪漫，', '交给想象。'], ['LOVE,', 'BEYOND THE ORDINARY.']],
    description: ['古风人物、樱花、云海与浮空建筑共同构建婚礼想象。以对称构图、柔和光线和仪式感场景，塑造浪漫而梦幻的宣传影像。', 'Historical-inspired characters, blossoms, seas of clouds and floating architecture form a romantic wedding fantasy. Symmetry, soft light and ceremonial settings create a dreamlike promotional film.'],
    tags: [['婚礼宣传', '幻想场景', '浪漫光影'], ['Wedding promo', 'Fantasy environments', 'Romantic lighting']],
  },
  {
    id: 'toy-cg', category: 'visual', accent: '#b2e8dc', style: 'playful',
    title: ['玩偶公仔 — 产品 CG', 'Collectible Figures — Product CG'],
    discipline: ['潮玩产品 / CG 展示', 'COLLECTIBLES / PRODUCT CG'],
    posterTitle: [['小小世界，', '无限想象。'], ['SMALL FIGURES.', 'WORLDS OF WONDER.']],
    description: ['围绕不同造型的玩偶公仔，构建花园、未来感装置与海洋等主题场景。用多变的材质、色彩和布景，把产品展示延展为一个个微型世界。', 'Collectible characters inhabit gardens, futuristic installations and ocean-inspired settings. Varied materials, colour palettes and environments turn the product showcase into a series of miniature worlds.'],
    tags: [['产品 CG', '场景设计', '材质与色彩'], ['Product CG', 'Environment design', 'Materials & colour']],
  },
  {
    id: 'toy-showroom', category: 'visual', accent: '#ecc4d9', style: 'playful',
    title: ['玩偶公仔 — 展厅宣传', 'Collectible Figures — Showroom Film'],
    discipline: ['潮玩推广 / 场景宣传', 'COLLECTIBLES / PROMOTIONAL FILM'],
    posterTitle: [['把喜爱，', '带进生活。'], ['A LITTLE WONDER,', 'EVERY DAY.']],
    description: ['从陈列空间到随身挂件与人物互动，串联公仔的产品形象和生活场景。多种角色造型共同构成轻盈、鲜明的潮玩推广影像。', 'From display arrangements to bag charms and character interactions, the film connects collectible designs with everyday life. A range of figures creates a light, distinctive promotional world.'],
    tags: [['展厅宣传', '产品陈列', '生活化应用'], ['Showroom promotion', 'Product display', 'Lifestyle scenes']],
  },
  {
    id: 'photograph', category: 'story', accent: '#d6c29e', style: 'cinema',
    title: ['《照片》— 时光的回声', 'The Photograph — Echoes of Time'],
    discipline: ['情感短片 / AI 叙事', 'EMOTIONAL DRAMA / AI SHORT'],
    posterTitle: [['一张照片，', '一段时光。'], ['ONE PHOTOGRAPH.', 'A LIFETIME WITHIN.']],
    description: ['以照片与代际关系为线索，通过老人、年轻人和日常室内场景，呈现记忆、牵挂与时间的情感回声，关注人物表情与生活质感。', 'A photograph and an intergenerational relationship connect older and younger characters in everyday interiors. The film explores memory, care and the passage of time through subtle expressions and lived-in detail.'],
    tags: [['情感叙事', '人物塑造', '生活质感'], ['Emotional storytelling', 'Character study', 'Everyday detail']],
  },
  {
    id: 'catzilla', category: 'story', accent: '#e5b9aa', style: 'epic',
    title: ['猫斯拉多多 — 奇境冒险', 'Catzilla Duoduo — A Fantastic Adventure'],
    discipline: ['奇幻冒险 / AI 影像', 'FANTASY ADVENTURE / AI FILM'],
    posterTitle: [['小小身影，', '巨大冒险。'], ['SMALL HERO.', 'EXTRAORDINARY WORLD.']],
    description: ['巨龙、猫咪、暴风海面与港口共同构成奇幻冒险场景。从宏大的生物交锋到人与猫的近距离互动，切换尺度与情绪，营造幻想叙事的张力。', 'Dragons, cats, stormy seas and a harbour form a fantasy-adventure world. Large-scale creature encounters contrast with intimate human-and-cat moments, shifting scale and emotion throughout the film.'],
    tags: [['奇幻生物', '场景叙事', '视觉特效'], ['Fantasy creatures', 'World building', 'Visual effects']],
  },
  {
    id: 'music-video', category: 'visual', accent: '#cad3ec', style: 'fashion',
    title: ['MV — 光影与节奏', 'Music Video — Light & Rhythm'],
    discipline: ['音乐影像 / 时尚视觉', 'MUSIC VIDEO / FASHION VISUAL'],
    posterTitle: [['光影有形，', '节奏无界。'], ['LIGHT TAKES FORM.', 'RHYTHM BREAKS FREE.']],
    description: ['以暗色舞台、金属质感造型与群舞构图建立音乐影像风格。镜头在人物近景和空间场面之间切换，以光线、服装与节奏塑造视觉表达。', 'Dark stages, metallic styling and choreographed group compositions establish the music video’s visual language. Close-ups and wider scenes use light, wardrobe and rhythm to shape a distinctive aesthetic.'],
    tags: [['音乐影像', '时尚造型', '舞台光影'], ['Music video', 'Fashion styling', 'Stage lighting']],
  },
];

for (let episode = 1; episode <= 4; episode++) {
  const code = `EP${String(episode).padStart(2, '0')}`;
  films.push({
    id: `drama-${code.toLowerCase()}`, category: 'drama', episode, accent: '#e6bc9b', style: 'drama',
    title: [`《一夜变老》— 第${episode}集`, `Aged Overnight — Episode ${episode}`],
    discipline: [`AI短剧 / 第${episode}集`, `AI SHORT DRAMA / EPISODE ${episode}`],
    posterTitle: [[code], [code]],
    description: [
      [
        'AI短剧系列第1集。海边宴会、夕光与人物特写建立故事场景，呈现人物互动与情绪变化。',
        'AI短剧系列第2集。延续海边宴会场景，通过人物近景、表情反应与场景切换展示连续叙事。',
        'AI短剧系列第3集。夜色、花廊与人物近景构成画面重点，关注角色互动、情绪变化与镜头衔接。',
        'AI短剧系列第4集。从室内切换至湖畔、码头与水上场景，展示多人调度、动作镜头与情绪表达。',
      ][episode - 1],
      [
        'Episode 1 of an AI short-drama series. A seaside reception, sunset lighting and character close-ups establish the setting and emotional interactions.',
        'Episode 2 continues the seaside reception through character close-ups, reaction shots and changing locations.',
        'Episode 3 brings night scenes, a flower-lined passage and intimate close-ups together, with an emphasis on character interactions and visual continuity.',
        'Episode 4 moves between interiors, a lakeside, a dock and water scenes, exploring ensemble staging, action and emotion.',
      ][episode - 1],
    ],
    tags: [['AI短剧', '竖屏叙事', '系列作品'], ['AI short drama', 'Vertical storytelling', 'Series']],
  });
}

films.push(...additionalFilms);
films.push(...shortFilms);

export const filmCount = films.length;

export function getFilms(language) {
  const index = language === 'en' ? 1 : 0;
  return films.map((film, i) => ({
    ...catalog[film.id], ...film,
    language, cover:posterDesigns[film.id],coverImage:publicAsset(posterAssets[film.id].src),
    image:publicAsset(catalog[film.id].image),video:publicAsset(catalog[film.id].video),
    number: String(i + 1).padStart(2, '0'),
    title: film.title[index], discipline: film.discipline[index],
    posterTitle: film.posterTitle[index], description: film.description[index],
    tags: film.tags[index],
    durationLabel: `${Math.floor(catalog[film.id].duration / 60)}:${String(Math.floor(catalog[film.id].duration % 60)).padStart(2, '0')}`,
  }));
}
