import { ManifestDashboard, ManifestGlobalContext } from '@umbraco-cms/backoffice/extension-registry';

export const partialsManifests: Array<ManifestDashboard> = [
    {
        type: 'dashboard',
        alias: 'xpedite.partialsDashboard',
        name: 'Partials',
        js: () => import('./dashboard.partials.ts'),
        weight: 100,
        meta: {
            label: 'Partials',
            pathname: 'xpedite-partials'
        },
        conditions: [
            {
                alias: 'Umb.Condition.SectionAlias',
                match: 'xpedite.Section'
            }
        ]
    }
];

export const partialsContextManifests : Array<ManifestGlobalContext> = [
    {
        type: 'globalContext',
        alias: 'xpedite.partials.context',
        name: 'xpedite partials context',
        js: () => import('./context.partials.ts')
    }
]