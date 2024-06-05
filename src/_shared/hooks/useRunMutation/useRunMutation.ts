import { useNotifications } from '../index';

/**
 * Returns a helper function that executes a mutation
 * for the entity that's passed in and displays the requisite
 * success or error message on completion.
 */
export const useRunMutation = () => {
  const { showNotification } = useNotifications();

  // TODO: improve types in function signature
  const runMutation = (
    mutateFunction: any,
    options: any,
    message?: string,
    successCallback?: (data?: any) => void,
    errorCallback?: () => void,
    refetch?: any,
  ): void => {
    mutateFunction(options)
      .then(({ data }: any) => {
        // manually refresh the cache if needed
        if (refetch) {
          refetch();
        }

        // let the user know all is well...
        message && showNotification(message, 'success');

        // execute any additional actions, i.e. hiding the edit form
        // or transitioning to another page
        if (successCallback) {
          successCallback(data);
        }
      })
      .catch((error: Error) => {
        // ...or not so much
        showNotification(error.message, 'error');

        // execute any additional actions, i.e. hiding the edit form
        if (errorCallback) {
          errorCallback();
        }
      });
  };

  return { runMutation };
};
