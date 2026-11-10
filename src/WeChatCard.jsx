import React from 'react';
import './new-collections.css';

export default function WeChatCard({profile, language, onOpen, large = false}) {
  const en = language === 'en';
  const Tag = onOpen ? 'button' : 'figure';
  return <Tag className={'wechat-contact-card' + (large ? ' is-large' : '')}
    type={onOpen ? 'button' : undefined} onClick={onOpen}
    aria-label={onOpen ? (en ? 'View WeChat contact QR code' : '查看微信联系二维码') : undefined}>
    <span className="wechat-qr-frame"><img src={profile.wechatQRCode}
      alt={en ? 'He Ganzhong’s WeChat contact QR code' : '何淦中的微信联系二维码'}
      width="630" height="645" loading="lazy"/></span>
    <span className="wechat-qr-caption"><strong>{en ? 'LET’S CONNECT ON WECHAT' : '微信联系'}</strong>
      <small>{en ? 'Scan with WeChat to add me' : '微信扫一扫，添加好友'}</small></span>
  </Tag>;
}
