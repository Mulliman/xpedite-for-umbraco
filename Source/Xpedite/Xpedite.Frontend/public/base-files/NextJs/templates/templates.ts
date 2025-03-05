import { lazy } from 'react';

export const templatesMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    home: lazy(() => import('./Home/Home')),
    page: lazy(() => import('./Page')),
  };

