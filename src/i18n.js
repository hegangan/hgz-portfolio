import { profile as sourceProfile, strengths as sourceStrengths } from './content';
import { filmCategories, getFilms, filmCount } from './films';

const zh = {
  language: 'EN', languageLabel: 'Switch the website to English',
  lightsOn: '开灯', lightsOff: '关灯', themeLight: '切换到明亮模式', themeDark: '切换到夜间模式',
  home: '首页', about: '关于', work: '作品', expertise: '优势', contact: '聊聊合作', contactShort: '联系',
  menu: '菜单', closeMenu: '关闭', openMenu: '打开导航', close: '关闭', closeModal: '关闭弹窗', skip: '跳转到内容',
  heroLines: ['让想象，', '成为', '影响力', '。'],
  heroIntro: ['我是何淦中，视觉 / AI / 品牌设计师', '从创意策划到成片，让想法获得新的生命。'],
  explore: '探索精选作品', scroll: '向下探索', playBg: '播放背景视频', pauseBg: '暂停背景视频',
  aboutKicker: '从视觉审美，到商业影像的完整表达',
  portraitAlt: '何淦中的彩色个人照片', portraitRoles: '视觉 · AI · 品牌',
  educationKicker: '设计的起点', aboutTitle: ['保持好奇，', '让创意持续', '生长。'],
  currentRole: '当前角色', startConversation: '联系我，开启一段对话',
  workKicker: '在每一个作品里，寻找不同的答案', workTitle: ['创意落地，', '不止于想象。'],
  workIntro: ['从品牌广告、情感叙事到幻想世界', '让真实作品，讲述我的视觉语言。'],
  filterLabel: '筛选作品', films: '部作品', selectedReel: '从这里认识我的创作', watch: '播放影片',
  watchLabel: '观看', viewFilm: '点击观看完整影片', allWorks: '展开全部作品', fewerWorks: '收起更多作品',
  shown: '已展示', of: '/', reelLabel: '创作精选',
  workFoot: '好的设计，让想法被看见，也被记住。',
  expertiseKicker: '不设边界，但始终有章法', expertiseTitle: ['多一维思考，', '多一种可能。'],
  expertiseIntro: ['摄影与设计，创意与生成。', '从个人创作到团队协作，推进完整交付。'],
  belief: ['好设计，始于理解。', '有表达，也有答案。'],
  available: '开放交流与创意合作', contactTitle: ['下一个好想法，', '我们', '一起', '实现'],
  contactIntro: ['关于一个项目、一个灵感，', '或者，只是打个招呼。'],
  openContact: '打开联系方式', backTop: '回到顶部',
  contactModalTitle: '从一句你好开始。',
  contactModalIntro: '我是何淦中，期待与你交流品牌视觉、AI 影像和新的创意可能。',
  email: '邮箱', phone: '电话', copy: '复制邮箱 ↗', copied: '已复制 ✓', sendEmail: '发送邮件',
  copyError: '请手动选择并复制邮箱地址',
  previous: '上一部', next: '下一部', filmDescription: '作品介绍', originalAudio: '原声影片',
  videoError: '视频暂时未能加载，请重试或打开独立播放页。', openVideo: '打开视频',
};

const en = {
  language: '中文', languageLabel: '切换网站为中文',
  lightsOn: 'Light', lightsOff: 'Dark', themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode',
  home: 'Home', about: 'About', work: 'Work', expertise: 'Expertise', contact: 'Let’s talk', contactShort: 'Contact',
  menu: 'Menu', closeMenu: 'Close', openMenu: 'Open navigation', close: 'Close', closeModal: 'Close dialog', skip: 'Skip to content',
  heroLines: ['IMAGINE.', 'MAKE AN ', 'IMPACT', '.'],
  heroIntro: ['I’m He Ganzhong. Visual, AI & brand designer.', 'Turning creative ideas into films and visual worlds.'],
  explore: 'Explore selected work', scroll: 'Scroll to explore', playBg: 'Play background video', pauseBg: 'Pause background video',
  aboutKicker: 'From visual sensibility to complete cinematic expression',
  portraitAlt: 'Colour portrait of He Ganzhong', portraitRoles: 'VISUAL · AI · BRAND',
  educationKicker: 'Where it began', aboutTitle: ['STAY CURIOUS.', 'KEEP IDEAS ', 'GROWING.'],
  currentRole: 'CURRENT ROLE', startConversation: 'Let’s start a conversation',
  workKicker: 'Different stories. One creative perspective.', workTitle: ['IDEAS INTO ', 'MOTION.'],
  workIntro: ['Brand stories, human emotions and imagined worlds.', 'A collection of films that speaks my visual language.'],
  filterLabel: 'Filter films', films: 'FILMS', selectedReel: 'A first look at my creative world', watch: 'Play film',
  watchLabel: 'Watch', viewFilm: 'WATCH THE FULL FILM', allWorks: 'Explore all films', fewerWorks: 'Show fewer films',
  shown: 'SHOWING', of: 'OF', reelLabel: 'CREATIVE SHOWREEL',
  workFoot: 'Good design makes ideas visible — and memorable.',
  expertiseKicker: 'An open mind. A considered process.', expertiseTitle: ['ONE MORE PERSPECTIVE.', 'ONE MORE POSSIBILITY.'],
  expertiseIntro: ['Photography and design. Creativity and generation.', 'From individual craft to coordinated delivery.'],
  belief: ['Good design begins with understanding.', 'An expression. And an answer.'],
  available: 'Open to conversations & creative collaborations', contactTitle: ['THE NEXT GOOD IDEA.', 'LET’S ', 'MAKE IT', ' HAPPEN.'],
  contactIntro: ['A project, a spark of inspiration,', 'or simply a hello.'],
  openContact: 'Open contact details', backTop: 'Back to top',
  contactModalTitle: 'It starts with hello.',
  contactModalIntro: 'I’m He Ganzhong. Let’s talk about brand design, AI filmmaking and new creative possibilities.',
  email: 'EMAIL', phone: 'PHONE', copy: 'Copy email ↗', copied: 'Copied ✓', sendEmail: 'Send an email',
  copyError: 'Please select and copy the email address manually.',
  previous: 'Previous', next: 'Next', filmDescription: 'ABOUT THE FILM', originalAudio: 'ORIGINAL AUDIO',
  videoError: 'This film could not be loaded. Please try again or open it in a separate player.', openVideo: 'Open video',
};

const englishProfile = {
  ...sourceProfile,
  name: 'He Ganzhong',
  role: 'Visual Designer / AI Designer / Brand Designer',
  currentRole: 'AI Creative Team Lead / AI Visual Designer',
  intro: 'I’m He Ganzhong, an AI visual designer and creative team lead with over two years of AIGC experience. With a background in visual communication and photography, I connect brand expression, cinematic language and generative technology. My work spans brand films, commercials, AI narratives and game-oriented videos, from creative development through final delivery.',
  stats: [
    {value:'02',suffix:'+',label:'Years creating with AIGC',note:'AI visuals & filmmaking'},
    {value:'06',label:'People in my AI team',note:'Team leadership & production'},
    {value:String(filmCount),label:'Films in this portfolio',note:'Short dramas · Commercial · CG'},
  ],
  experience: [
  {
    "startDate": "2026-04",
    "period": "APR 2026 — PRESENT",
    "company": "Guizhou Jiatailihua Information Technology · Shenzhen",
    "role": "AI Visual Designer / AI Creative Team Lead",
    "detail": "Lead a six-person team, including myself, while remaining hands-on in creative production, troubleshooting and quality review. Work spans client discovery, estimates, scripts, assets, prompts, generation, editing and final delivery for commercial films, dramas, animation and game-related content.",
    "highlights": [
      {
        "title": "Client discovery & creative direction",
        "text": "Assess requirements, quote projects and evaluate production feasibility. Define the direction around the product, communication goals and delivery requirements, then develop scripts with the team."
      },
      {
        "title": "Team coordination & training",
        "text": "Allocate work and schedules across the six-person team, including myself. Coordinate assets, AI generation and editing, and lead training and production standards."
      },
      {
        "title": "Creative & technical troubleshooting",
        "text": "Adjust and review product, character and environment assets and prompts. Step in when asset preparation stalls, repeated generations fail, or visual style drifts; refine lighting, staging and shot expression."
      },
      {
        "title": "Review & final delivery",
        "text": "Review generated footage and finished films, specify revisions and verify results, coordinating material organisation, editing, final changes and delivery."
      },
      {
        "title": "Selected commercial work",
        "text": "Independently produce or oversee China Eastern service films, CONFU hair-dryer advertising, AI wedding films, drama visual effects and game-related AI videos."
      }
    ]
  },
  {
    "startDate": "2025-06",
    "period": "JUN 2025 — JAN 2026",
    "company": "Shenzhen Qiqige Technology · TikTok Cross-border Commerce",
    "role": "Short-form Video Director / TikTok",
    "detail": "Translated the functions and use cases of ergonomic cushions, walking aids, and ankle and knee supports into marketing videos, covering product messaging, scripts, advertising copy, voiceovers and editing."
  }
],
  education: {school:'Guangdong University of Science and Technology',major:'Visual Communication Design',degree:'Full-time Bachelor’s Degree',courses:'Advertising · Brand identity · Editorial & illustration · Packaging · Photography & direction · Cinematography · Motion & interaction'},
  awards:['Provincial Third Prize · National College Student Advertising Art Competition · Now/Future AD Calcium','First Prize · Cantonese Painted Porcelain Design Competition'],
};

const englishStrengths = [
  {number:'01',icon:'spark',title:'AI Visual Creation',en:'AIGC & VISUAL CREATION',text:'Over two years of AIGC visual-creation experience using Stable Diffusion, Midjourney and Photoshop. Work spans AI video generation, character and environment assets, consistent visual styles and post-production, with independent delivery from initial concept to finished film.',tags:['AI video generation','Asset consistency','End-to-end production']},
  {number:'02',icon:'eye',title:'Film & Commercial Work',en:'FILM & COMMERCIAL PRODUCTION',text:'Experience in photography, video direction and commercial visual production, including scripts, camera language, storyboards, composition, lighting and editing. Projects include China Eastern brand films, AI wedding films, CONFU commercials, drama visual effects and game-oriented AI videos.',tags:['Scripts & storyboards','Brand & product films','Creative execution']},
  {number:'03',icon:'eye',title:'Photography & Visual Craft',en:'PHOTOGRAPHY & VISUAL CRAFT',text:'Years of professional photography experience with digital cameras and related equipment, including fruit, product and portrait photography. Composition, lighting and colour inform my AIGC work, bringing believable detail and commercial quality to each image.',tags:['Product & portrait photography','Composition & lighting','Believable imagery']},
  {number:'04',icon:'orbit',title:'Team Leadership & Delivery',en:'TEAM LEADERSHIP & DELIVERY',text:'Experience managing a six-person AI visual team, covering task allocation, coordination, schedules and quality control. Familiar with the complete workflow from client requirements and creative planning through production and delivery.',tags:['Six-person team','Schedules & quality','Production coordination']},
  {number:'05',icon:'spark',title:'Professional Practice',en:'MINDSET & PROFESSIONAL PRACTICE',text:'A steady, responsible and detail-oriented approach, with a collaborative mindset and the ability to work under pressure. Eager to learn new technology, adapt to changes in AI production and solve practical problems while balancing creative thinking, execution and results.',tags:['Continuous learning','Problem solving','Responsibility & execution']},
  {number:'06',icon:'grid',title:'Skill Design & Iteration',en:'SKILL DESIGN & ITERATION',text:'Turn recurring tasks into reusable Skills with clear instructions, tool workflows, asset conventions and quality checks. Refine them through practical feedback to improve consistency and creative delivery.',tags:['Workflow design','Iterative improvement']},
];

export function getContent(language) {
  const isEnglish=language==='en';
  return {
    t: isEnglish ? en : zh,
    profile: isEnglish ? englishProfile : sourceProfile,
    strengths: isEnglish ? englishStrengths : sourceStrengths,
    projects: getFilms(language),
    categories: filmCategories.map(c=>({id:c.id,label:isEnglish?c.en:c.zh})),
  };
}
