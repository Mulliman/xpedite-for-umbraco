import React from 'react';
import { render } from '@testing-library/react';
import { TypedUmbracoNode } from "@/umbraco/types";
import Page, { PageProps  } from '../Page';

describe('Page', () => {

    const testData = {
        // Fill in props with some test data
    } as TypedUmbracoNode<PageProps>;

    const emptyTestData = {
        // Fill in props with with the empty state
    } as TypedUmbracoNode<PageProps>;

    it('matches snapshot', () => {
        const { asFragment } = render(<Page {...testData} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('contains expected element example', () => {
        const { container } = render(<Page {...testData} />);
        expect(container.innerHTML).toContain('Replace with expected data');
    });

    it('renders valid output when properties are empty', () => {
        const { container } = render(<Page {...emptyTestData} />);
        expect(container.innerHTML).toContain('<div class=""></div>');

    });
});