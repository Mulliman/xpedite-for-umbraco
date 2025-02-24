import React from 'react';
import { render } from '@testing-library/react';
import PageHeading, { PageHeadingProps  } from '../PageHeading';

describe('PageHeading', () => {

    const testData = {
        pageTitle: "Hello, this is a test"
    } as PageHeadingProps;

    const emptyTestData = {
        // Fill in props with with the empty state
    } as PageHeadingProps;

    it('matches snapshot', () => {
        const { asFragment } = render(<PageHeading {...testData} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('contains expected element example', () => {
        const { container } = render(<PageHeading {...testData} />);
        expect(container.innerHTML).toContain(`<h1>${testData.pageTitle}</h1>`);
    });

    it('renders valid output when properties are empty', () => {
        const { container } = render(<PageHeading {...emptyTestData} />);
        expect(container.innerHTML).toContain('<h1></h1>');
    });
});