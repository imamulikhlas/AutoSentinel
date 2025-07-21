"use client"

// Custom SVG Icons for better visual appeal
export const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BrainIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.5 2C8.5 2 7.5 2.5 7 3.5C6.5 2.5 5.5 2 4.5 2C2.5 2 1 3.5 1 5.5C1 6.5 1.5 7.5 2.5 8C1.5 8.5 1 9.5 1 10.5C1 12.5 2.5 14 4.5 14C5.5 14 6.5 13.5 7 12.5C7.5 13.5 8.5 14 9.5 14C11.5 14 13 12.5 13 10.5C13 9.5 12.5 8.5 11.5 8C12.5 7.5 13 6.5 13 5.5C13 3.5 11.5 2 9.5 2Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M9.5 2C8.5 2 7.5 2.5 7 3.5C6.5 2.5 5.5 2 4.5 2C2.5 2 1 3.5 1 5.5C1 6.5 1.5 7.5 2.5 8C1.5 8.5 1 9.5 1 10.5C1 12.5 2.5 14 4.5 14C5.5 14 6.5 13.5 7 12.5C7.5 13.5 8.5 14 9.5 14C11.5 14 13 12.5 13 10.5C13 9.5 12.5 8.5 11.5 8C12.5 7.5 13 6.5 13 5.5C13 3.5 11.5 2 9.5 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="8" r="6" fill="currentColor" fillOpacity="0.1" />
    <path
      d="M16 14C19.31 14 22 11.31 22 8C22 4.69 19.31 2 16 2C15.5 2 15 2.1 14.5 2.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M14 6L16 8L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ZapIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" fillOpacity="0.2" />
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const CodeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="18" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 9L5 12L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 9L19 12L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const TrophyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 9H4.5C3.12 9 2 10.12 2 11.5S3.12 14 4.5 14H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 9H19.5C20.88 9 22 10.12 22 11.5S20.88 14 19.5 14H18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 9V7C6 4.79 7.79 3 10 3H14C16.21 3 18 4.79 18 7V9" fill="currentColor" fillOpacity="0.2" />
    <path
      d="M6 9V7C6 4.79 7.79 3 10 3H14C16.21 3 18 4.79 18 7V9V14C18 16.21 16.21 18 14 18H10C7.79 18 6 16.21 6 14V9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const SearchIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" fill="currentColor" fillOpacity="0.1" />
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SparklesIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 3Z"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path
      d="M12 3L13.09 8.26L18 9L13.09 9.74L12 15L10.91 9.74L6 9L10.91 8.26L12 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M19 3L19.5 4.5L21 5L19.5 5.5L19 7L18.5 5.5L17 5L18.5 4.5L19 3Z" fill="currentColor" />
    <path d="M19 15L19.5 16.5L21 17L19.5 17.5L19 19L18.5 17.5L17 17L18.5 16.5L19 15Z" fill="currentColor" />
  </svg>
)

export const RocketIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.5 16.5C4.5 16.5 5.5 17.5 8 15C10.5 12.5 12 10 12 10L14 12C14 12 11.5 13.5 9 16C6.5 18.5 4.5 16.5 4.5 16.5Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path d="M12 15L9 12L15 6C16 5 17.5 4.5 19 4.5C19.5 6 19 7.5 18 8.5L12 15Z" fill="currentColor" fillOpacity="0.3" />
    <path
      d="M12 15L9 12L15 6C16 5 17.5 4.5 19 4.5C19.5 6 19 7.5 18 8.5L12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 16.5C4.5 16.5 5.5 17.5 8 15C10.5 12.5 12 10 12 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15 9L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M2.5 21.5L7.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
