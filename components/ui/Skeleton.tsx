import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-slate-200/75 after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent ${className}`}
      {...props}
    />
  )
}

export default Skeleton
