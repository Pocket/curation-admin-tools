import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarkdownPreview } from './MarkdownPreview';

describe('The MarkdownPreview component', () => {
  const markdownSource =
    '* Lists\n' +
    '* [ ] todo\n' +
    '* [x] done\n' +
    '\n' +
    'A table:\n' +
    '\n' +
    '| a | b |\n' +
    '| - | - |\n' +
    '\n' +
    '## A heading\n' +
    '\n' +
    '```\n' +
    'a code block\n' +
    '```';

  it('renders the default tab successfully', () => {
    render(
      <MarkdownPreview minHeight={10} source={markdownSource}>
        <textarea value={markdownSource} onChange={jest.fn()} />
      </MarkdownPreview>
    );

    // Let's check if we can see the tabs
    expect(screen.getByText('Write')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();

    // And the textarea field
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders markdown on the "Preview" tab', () => {
    render(
      <MarkdownPreview minHeight={10} source={markdownSource}>
        <textarea value={markdownSource} onChange={jest.fn()} />
      </MarkdownPreview>
    );

    userEvent.click(screen.getByText(/preview/i));

    // Expect to see a heading defined in the source as "## A heading"
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
