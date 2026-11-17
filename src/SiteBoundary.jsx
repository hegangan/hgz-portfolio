import React from 'react';
export default class SiteBoundary extends React.Component{
  state={failed:false};
  static getDerivedStateFromError(){return{failed:true}}
  render(){return this.state.failed?<main style={{maxWidth:720,margin:'12vh auto',padding:30,lineHeight:1.8}}><h1>何淦中 · AIGC 视觉设计师</h1><p>页面暂时未能完整显示，请重新加载或切换入口。</p><p><a href="?lite=1">打开轻量模式</a> · <a href="https://hgz-portfolio.pages.dev/">Cloudflare 入口</a> · <a href="https://hegangan.github.io/hgz-portfolio/">GitHub 入口</a></p><p><a href="tel:13640399633">13640399633</a><br/><a href="mailto:609721033@qq.com">609721033@qq.com</a></p></main>:this.props.children}
}
