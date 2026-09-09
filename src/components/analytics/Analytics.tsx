'use client';

import TikTokPixel from './TikTokPixel';
import MetaPixel from './MetaPixel';
import GoogleTagManager from './GoogleTagManager';

export default function Analytics() {
  return (
    <>
      <TikTokPixel />
      <MetaPixel />
      <GoogleTagManager />
    </>
  );
}
