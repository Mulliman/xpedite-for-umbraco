import { ManifestDashboard, ManifestGlobalContext } from '@umbraco-cms/backoffice/extension-registry';

export const blockManifests: Array<ManifestDashboard> = [
    {
        type: 'dashboard',
        alias: 'xpedite.blocksDashboard',
        name: 'Blocks',
        js: () => import('./dashboard.blocks.ts'),
        weight: 100,
        meta: {
            label: 'Blocks',
            pathname: 'xpedite-blocks'
        },
        conditions: [
            {
                alias: 'Umb.Condition.SectionAlias',
                match: 'xpedite.Section'
            }
        ]
    }
];

export const blocksContextManifests : Array<ManifestGlobalContext> = [
    {
        type: 'globalContext',
        alias: 'xpedite.blocks.context',
        name: 'xpedite blocks context',
        js: () => import('./context.blocks.ts')
    }
]