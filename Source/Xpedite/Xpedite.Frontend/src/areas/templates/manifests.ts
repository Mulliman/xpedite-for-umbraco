import { ManifestDashboard, ManifestGlobalContext } from '@umbraco-cms/backoffice/extension-registry';

export const templatesManifests: Array<ManifestDashboard> = [
    {
        type: 'dashboard',
        alias: 'xpedite.templatesDashboard',
        name: 'Templates',
        js: () => import('./dashboard.templates.ts'),
        weight: 100,
        meta: {
            label: 'Templates',
            pathname: 'xpedite-templates'
        },
        conditions: [
            {
                alias: 'Umb.Condition.SectionAlias',
                match: 'xpedite.Section'
            }
        ]
    }
];

export const templatesContextManifests : Array<ManifestGlobalContext> = [
    {
        type: 'globalContext',
        alias: 'xpedite.templates.context',
        name: 'xpedite templates context',
        js: () => import('./context.templates.ts')
    },
    {
        type: 'globalContext',
        alias: 'xpedite.templatesAssistant.context',
        name: 'xpedite templates assistant context',
        js: () => import('./context.templatesAssistant.ts')
    }
]