import React from 'react';
import { render } from '@testing-library/react';
import RichTextBlock from '../RichTextBlock';

describe('RichTextBlock', () => {

    it('matches snapshot', () => {
        const content = {
            contentType: 'test',
            id: '111-1111-1111',
            properties: {
                richText: '<p>This is a snapshot test</p>'
            },
            settings: {
                
            }
        };

        const { asFragment } = render(<RichTextBlock content={content} />);
        expect(asFragment()).toMatchSnapshot();
    });


    it('renders rich text content', () => {
        const content = {
            contentType: 'test',
            id: '111-1111-1111',
            properties: {
                richText: '<p>This is a test</p>'
            },
            settings: {
                
            }
        };

        const { container } = render(<RichTextBlock content={content} />);
        expect(container.innerHTML).toContain('<p>This is a test</p>');
    });

    it('renders empty div when richText is empty', () => {
        const content = {
            contentType: 'test',
            id: '111-1111-1111',
            properties: {
                richText: ''
            },
            settings: {
                
            }
        };

        const { container } = render(<RichTextBlock content={content} />);
        expect(container.innerHTML).toContain('<div class=""></div>');
    });
});