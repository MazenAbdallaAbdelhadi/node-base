import { useQueryStates } from "nuqs";

import { credentialsParams } from "../params";

/**
 * Hook to get and manage credentials query parameters.
 */
export const useCredentialsParams = () => {
  return useQueryStates(credentialsParams);
};
