import {publicAsset} from './site-assets';
import { filmCount } from './films';
// 个人资料依据用户简历及后续更正整理，作品数量与作品目录同步。
export const profile = {
  name: '何淦中',
  englishName: 'HE GANZHONG',
  targetSalary: '13–16K',
  heroPortrait: publicAsset('/images/he-ganzhong-hero-cutout.png'),
  monogram: 'H.GZ',
  role: '视觉设计师 / AI 设计师 / 品牌设计师',
  currentRole: 'AI 团队负责人 / AI 视觉设计师',
  email: '609721033@qq.com',
  phone: '13640399633',
  qq: '609721033',
  portrait: publicAsset('/images/he-ganzhong-formal.jpg'),
  intro: '我是何淦中，拥有两年以上 AIGC 视觉创作经验，现任 AI 团队负责人 / AI 视觉设计师。以视觉传达设计与摄影为基础，连接品牌表达、镜头语言和生成式技术，参与并带领团队完成品牌宣传、商业广告、AI 短剧及游戏向视频等项目，从创意策划一路推进到成片交付。',
  stats: [
    { value: '02', suffix: '+', label: '年 AIGC 创作经验', note: 'AI 视觉 / 视频生成' },
    { value: '06', label: '人 AI 创作团队', note: '团队管理 / 项目统筹' },
    { value: String(filmCount), label: '部影片展示', note: '短剧 / 商业 / 叙事 / CG / 音乐影像' },
  ],
  experience: [
  {
    "startDate": "2026-04",
    "period": "2026.04 — 至今",
    "company": "贵州迦太利华信息科技有限公司 · 深圳分公司",
    "role": "AI 视觉设计师 / AI 团队负责人",
    "detail": "统筹包含本人在内的 6 人团队，兼顾亲自创作、制作支持与质量审核。贯穿需求沟通、评估报价、创意脚本、资产及提示词、生成剪辑与最终交付，承接商业广告、短剧、漫剧、CG 及游戏向内容。",
    "highlights": [
      {
        "title": "项目承接与创意方向",
        "text": "负责客户前期沟通、需求评估、报价及制作可行性判断；结合产品、内容目标与交付要求确定视频方向，组织脚本梳理。"
      },
      {
        "title": "团队统筹与人员培训",
        "text": "负责 6 人团队（含本人）的分工、排期与制作协作，组织资产制作、AI 视频生成及后期剪辑，主导人员培训与制作规范落实。"
      },
      {
        "title": "技术与创意支持",
        "text": "参与产品、人物、场景资产及提示词的调整与审核。在资产制作卡壳、生成结果反复不理想或风格跑偏时介入处理，校正光影、人物场景适配和镜头表现。"
      },
      {
        "title": "审核修改与最终交付",
        "text": "负责视频与成片审核，提出修改要求并跟进结果，衔接素材归类、后期剪辑、成片修订与最终交付。"
      },
      {
        "title": "代表项目",
        "text": "独立制作或统筹东方航空服务短片、康夫吹风机广告、AI 婚礼宣传片、短剧特效及游戏向 AI 视频等商业内容。"
      }
    ]
  },
  {
    "startDate": "2025-06",
    "period": "2025.06 — 2026.01",
    "company": "深圳市柒柒戈科技有限公司 · TikTok 跨境",
    "role": "短视频编导 / TikTok 跨境",
    "detail": "围绕护腰坐姿垫、助行器、护踝护膝等产品拆解卖点，完成视频脚本、宣传文案、口播内容及后期剪辑，将产品功能与使用场景转化为营销视频。"
  }
],
  education: { school: '广东科技学院', major: '视觉传达设计', degree: '全日制本科', courses: '商业广告 · 品牌视觉 · 版式与插画 · 包装设计 · 摄影与编导 · 摄像 · 动态视觉 · 交互设计' },
  awards: ['大广赛省级三等奖 · 获奖项目「现在未来AD钙」', '广彩盘设计比赛一等奖'],
  tools: ['Midjourney', 'Stable Diffusion', 'Photoshop', 'Lightroom', 'Premiere', 'CapCut', 'Procreate', 'PowerPoint', 'ChatGPT'],
};

export const strengths = [
  { number: '01', icon: 'spark', title: 'AI 视觉创作与技术', en: 'AIGC & VISUAL CREATION', text: '拥有两年以上 AIGC 视觉创作经验，熟练掌握 Stable Diffusion、Midjourney、Photoshop 等 AI 绘图及平面设计工具。具备 AI 视频生成、角色与场景资产设计、视觉风格统一及后期制作能力，能够独立完成从创意构思到成片交付的全流程制作。', tags: ['AI 视频生成', '角色与场景一致性', '全流程制作'] },
  { number: '02', icon: 'eye', title: '影视制作与商业项目', en: 'FILM & COMMERCIAL PRODUCTION', text: '具备摄影、视频编导及商业视觉创作经验，熟悉脚本策划、镜头语言、分镜设计、画面构图、光影控制与后期剪辑。参与东方航空品牌宣传、AI 婚礼宣传片、康夫吹风机广告、短剧视觉特效及游戏向 AI 视频等项目，能够推进创意执行与项目落地。', tags: ['脚本 / 分镜 / 剪辑', '品牌与产品广告', '商业交付'] },
  { number: '03', icon: 'eye', title: '摄影技术与视觉审美', en: 'PHOTOGRAPHY & VISUAL CRAFT', text: '拥有多年专业摄影经验，熟练操作数码相机及相关摄影器材，在水果、产品、人像摄影等领域积累实拍经验。具备扎实的构图、布光、色彩搭配与视觉表现能力，将传统摄影技术与 AIGC 创作结合，提升作品的真实感与商业质感。', tags: ['产品 / 人像 / 水果摄影', '构图与布光', '真实感与质感'] },
  { number: '04', icon: 'orbit', title: '团队管理与统筹协作', en: 'TEAM LEADERSHIP & DELIVERY', text: '具备 6 人 AI 视觉创作团队的管理经验，能够进行人员分工、任务协调、项目排期及制作质量把控。熟悉从需求沟通、创意策划到制作交付的完整流程，具备团队协作、沟通协调与项目推进能力。', tags: ['6 人团队管理', '排期与质量把控', '全流程统筹'] },
  { number: '05', icon: 'spark', title: '职业素养与综合能力', en: 'MINDSET & PROFESSIONAL PRACTICE', text: '性格随和稳重，责任心强，工作踏实细致，具有团队合作意识与抗压能力。对新技术保持学习热情，能够快速适应 AI 行业技术迭代，分析并解决制作中的实际问题，兼顾创意思维、执行效率与结果导向。', tags: ['学习与适应', '问题解决', '责任与执行'] },
  { number: '06', icon: 'grid', title: 'Skill 制作与迭代', en: 'SKILL DESIGN & ITERATION', text: '围绕真实任务设计可复用的 Skill 工作流，沉淀提示词、工具协作、素材规范与质量检查。结合使用反馈持续迭代，让创作方法更清晰、制作流程更高效。', tags: ['工作流设计', '迭代优化'] },
];
