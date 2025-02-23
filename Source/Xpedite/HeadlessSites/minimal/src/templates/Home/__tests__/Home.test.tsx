import React from 'react';
import { render } from '@testing-library/react';
import { TypedUmbracoNode } from "@/umbraco/types";
import Home, { HomeProps  } from '../Home';

describe('Home', () => {

    const testData = {
        // Fill in props with some test data
    } as TypedUmbracoNode<HomeProps>;

    const emptyTestData = {
        // Fill in props with with the empty state
    } as TypedUmbracoNode<HomeProps>;

    it('matches snapshot', () => {
        const { asFragment } = render(<Home {...testData} />);
        expect(asFragment()).toMatchSnapshot();
    });
});