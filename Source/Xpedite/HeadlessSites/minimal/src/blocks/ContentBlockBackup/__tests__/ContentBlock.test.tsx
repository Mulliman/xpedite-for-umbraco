import React from 'react';
import { render } from '@testing-library/react';
import { TypedUmbracoNode } from "@/umbraco/types";
import ContentBlock, { ContentBlockProps  } from '../ContentBlock';

describe('ContentBlock', () => {

    const testData = {
        // Fill in props with some test data
    } as TypedUmbracoNode<ContentBlockProps>;

    const emptyTestData = {
        // Fill in props with with the empty state
    } as TypedUmbracoNode<ContentBlockProps>;

    it('matches snapshot', () => {
        const { asFragment } = render(<ContentBlock {...testData} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('contains expected element example', () => {
        const { container } = render(<ContentBlock {...testData} />);
        expect(container.innerHTML).toContain('Replace with expected data');
    });

    it('renders valid output when properties are empty', () => {
        const { container } = render(<ContentBlock {...emptyTestData} />);
        expect(container.innerHTML).toContain('<div class=""></div>');
    });
});