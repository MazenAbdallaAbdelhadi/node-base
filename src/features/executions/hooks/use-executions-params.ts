import { useQueryStates } from "nuqs";

import { executionsParams } from "../params";

/**
 * Hook to get and manage executions query parameters.
 */
export const useExecutionsParams = () => {
  return useQueryStates(executionsParams);
};
