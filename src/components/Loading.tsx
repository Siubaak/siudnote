import TrueFocus from '@/components/ui/true-focus';

export function Loading() {
  return <div className="absolute inset-0 z-999 flex justify-center backdrop-blur-md bg-[rgba(0,0,0,0.5)]">
    <TrueFocus
      sentence="SiuDNote Loading"
      borderColor="hsl(var(--ring))"
    />
  </div>
}