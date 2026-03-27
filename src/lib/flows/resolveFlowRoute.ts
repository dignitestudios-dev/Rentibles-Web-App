export type FlowContext = Record<string, boolean | string | null | undefined>;

export type FlowStep = {
  path: string;
  canAccess: (context: FlowContext) => boolean;
};

type ResolveFlowRouteArgs = {
  currentPath: string;
  steps: FlowStep[];
  startPath: string;
  context: FlowContext;
};

/**
 * Returns the allowed route for a multi-step flow:
 * - keep current path if it's accessible
 * - otherwise route to first accessible step
 * - fallback to flow start
 */
export function resolveFlowRoute({
  currentPath,
  steps,
  startPath,
  context,
}: ResolveFlowRouteArgs): string {
  const currentStep = steps.find((step) => step.path === currentPath);
  if (currentStep?.canAccess(context)) return currentPath;

  const firstAccessibleStep = steps.find((step) => step.canAccess(context));
  return firstAccessibleStep?.path || startPath;
}
