import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useNotifications } from './useNotifications';
import { SnackbarProvider } from 'notistack';

describe('The useNotification hook', () => {
  const wrapper: React.FC = (props): JSX.Element => (
    <SnackbarProvider maxSnack={3}>{props.children}</SnackbarProvider>
  );

  it('returns a helper function', async () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    const { showNotification } = result.current;
    expect(showNotification).toBeDefined();
  });

  xit('shows a success message', async () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    const message = 'This is a test notification';

    act(() => {
      result.current.showNotification(message, 'success');
    });

    // TODO: verify the notification appears
  });
});
