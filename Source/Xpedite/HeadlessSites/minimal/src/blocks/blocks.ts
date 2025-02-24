import { lazy } from 'react';

export const blocksMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    // example: lazy(() => import('./example'))
    richTextBlock: lazy(() => import('./RichTextBlock')),
    contentBlock: lazy(() => import('./ContentBlock')),
  };

