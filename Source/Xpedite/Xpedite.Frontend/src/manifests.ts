import { ManifestSection } from '@umbraco-cms/backoffice/extension-registry';
import { startManifests } from './areas/start/manifests.ts';
import { blockManifests, blocksContextManifests } from './areas/blocks/manifests.ts';
import { templatesContextManifests, templatesManifests } from './areas/templates/manifests.ts';
import { partialsContextManifests, partialsManifests } from './areas/partials/manifests.ts';

const section : ManifestSection = {
  alias: 'xpedite.Section',
  name: 'XPEDITE',
  type: 'section',
  meta: {
      label: 'XPEDITE',
      pathname: 'xpedite',
  },
}

const manifests = [
  section,
  ...startManifests,
  ...templatesManifests,
  ...templatesContextManifests,
  ...partialsManifests,
  ...partialsContextManifests,
  ...blockManifests,
  ...blocksContextManifests,
];

export default manifests;
