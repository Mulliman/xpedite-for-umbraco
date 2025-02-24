import React from 'react';
import { render } from '@testing-library/react';
import { TypedUmbracoNode } from "@/umbraco/types";
import RichTextBlock, { RichTextBlockProps  } from '../RichTextBlock';

describe('RichTextBlock', () => {

    const testData = {
        // Fill in props with some test data
    } as TypedUmbracoNode<RichTextBlockProps>;

    const emptyTestData = {
        // Fill in props with with the empty state
    } as TypedUmbracoNode<RichTextBlockProps>;

    it('matches snapshot', () => {
        const { asFragment } = render(<RichTextBlock {...testData} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('contains expected element example', () => {
        const { container } = render(<RichTextBlock {...testData} />);
        expect(container.innerHTML).toContain('Replace with expected data');
    });

    it('renders valid output when properties are empty', () => {
        const { container } = render(<RichTextBlock {...emptyTestData} />);
        expect(container.innerHTML).toContain('<div class=""></div>');
    });
});