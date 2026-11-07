import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
const requested=process.env.PAGES_BASE_PATH||'/';
const base='/'+requested.replace(/^\/+|\/+$/g,'')+(requested==='/'?'':'/');
const siteURL=process.env.PAGES_SITE_URL?.replace(/\/+$/,'');
export default defineConfig({
  base:base==='//'?'/':base,
  plugins:[react(),{
    name:'pages-social-metadata',
    transformIndexHtml(html){
      html=html.replace(/\s*<link rel="canonical"[^>]*>/g,'').replace(/\s*<meta property="og:(url|image)"[^>]*>/g,'');
      if(!siteURL)return html;
      return html.replace('</head>', '<link rel="canonical" href="'+siteURL+'/"/><meta property="og:url" content="'+siteURL+'/"/><meta property="og:image" content="'+siteURL+'/images/projects/showreel.jpg"/></head>');
    }
  }]
});
