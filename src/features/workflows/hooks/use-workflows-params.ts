import { useQueryStates } from "nuqs";

import { workflowParams } from "../params";

/**
 * Hook to get and manage workflows query parameters.
 */
export const useWorkflowsParams = () => {
  return useQueryStates(workflowParams);
};
