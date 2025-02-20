import { ManifestDashboard } from '@umbraco-cms/backoffice/extension-registry';

export const startManifests: Array<ManifestDashboard> = [
    {
        type: 'dashboard',
        alias: 'xpedite.startDashboard',
        name: 'Get Started',
        js: () => import('./dashboard.start.ts'),
        weight: 100,
        meta: {
            label: 'Get Started',
            pathname: 'xpedite'
        },
        conditions: [
            {
                alias: 'Umb.Condition.SectionAlias',
                match: 'xpedite.Section'
            }
        ]
    }
];