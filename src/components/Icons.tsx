import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
})

export const StarIcon = (props: IconProps) => (
  <svg {...base(props)} fill="currentColor" stroke="currentColor">
    <path d="m12 2.8 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
)

export const HomeIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10M9.5 20v-6h5v6" /></svg>
)

export const PlusIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M12 5v14M5 12h14" /></svg>
)

export const CalendarIcon = (props: IconProps) => (
  <svg {...base(props)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
)

export const ChartIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
)

export const FlameIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M12.5 22c4 0 7-2.8 7-6.8 0-3.3-1.8-6.2-5.2-9.2.1 3-1.3 4.3-2.5 5.1.2-3.7-1.9-6.5-4.6-8.6.3 4.3-2.7 6.6-2.7 11.7 0 4.6 3.4 7.8 8 7.8Z" /><path d="M10.4 18.8c-1.6-2.3.2-4 1.8-5.8.1 1.7 1 2.6 1.7 3.4.8 1 .5 2.7-.5 3.4" /></svg>
)

export const ChevronIcon = ({ direction = 'right', ...props }: IconProps & { direction?: 'left' | 'right' }) => (
  <svg {...base(props)}><path d={direction === 'right' ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} /></svg>
)

export const EditIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="m14 5 5 5M4 20l3.5-.8L19 7.7a2.1 2.1 0 0 0-3-3L4.8 16.3z" /></svg>
)

export const TrashIcon = (props: IconProps) => (
  <svg {...base(props)}><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></svg>
)
