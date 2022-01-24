import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ScrollToTop } from './ScrollToTop';

describe('The ScrollToTop component', () => {
  it('scrolls to the top on moving from page to page', () => {
    const history = createMemoryHistory();

    window.scrollTo = jest.fn();

    render(
      <MemoryRouter initialEntries={[`/en-US/newtab/`]}>
        <ScrollToTop />
      </MemoryRouter>
    );

    // move to another page
    history.push('/prospects/?page=2');

    expect(window.scrollTo).toHaveBeenCalled();
  });
});
