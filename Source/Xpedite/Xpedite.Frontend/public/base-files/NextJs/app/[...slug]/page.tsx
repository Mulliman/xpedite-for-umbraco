import { TemplateRenderer } from '@/templates/TemplateRenderer';
import { getAllContentAsync, getContentItemAsync } from '@/umbraco/contentApi';

import { getNextJsCompatibleSlug } from '@/utils';

const page = async ({ params }: { params: any }) => {
    const { slug } = await params;
    const path = slug.join('/');

    const currentPage = await getContentItemAsync('Home', path);

    return TemplateRenderer(currentPage);
}

export async function generateStaticParams(): Promise<any> {
    const pages = await getAllContentAsync('Home');

    return pages.map((page: any) => ({
        slug: getNextJsCompatibleSlug(page.route.path)
      }));
};


export default page;