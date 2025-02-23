import { lazy } from 'react';

export const blocksMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    // example: lazy(() => import('./example'))
    richTextElement: lazy(() => import('./RichText')),
  };

