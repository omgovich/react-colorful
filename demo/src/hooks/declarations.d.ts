declare module "use-throttled-effect" {
  export default function useThrottledEffect(
    callback: React.EffectCallback,
    delay: number,
    deps?: React.DependencyList | undefined
  ): void;
}
