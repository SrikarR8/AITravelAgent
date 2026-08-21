import React from 'react'

export interface LogoProps {
  className?: string
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  const style = size ? { width: size, height: size } : undefined

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Outer organic dark green shape */}
      <path
        d="M 68 34 
           C 50 34, 38 48, 38 78 
           C 38 115, 38 145, 52 170 
           C 62 186, 79 184, 82 165 
           C 85 142, 77 98, 77 72 
           C 77 56, 84 50, 94 68 
           C 107 92, 134 144, 150 174 
           C 161 194, 178 180, 174 154 
           C 164 92, 153 62, 153 48 
           C 153 35, 142 32, 131 38 
           C 120 44, 123 60, 126 78 
           C 129 99, 133 126, 122 108 
           C 106 78, 86 34, 68 34 Z"
        fill="#1b4332"
      />
      {/* Inner white fluid cutout */}
      <path
        d="M 67 48 
           C 75 62, 75 92, 67 122 
           C 62 140, 54 124, 54 94 
           C 54 66, 61 45, 67 48 Z"
        fill="#ffffff"
      />
    </svg>
  )
}

export default Logo
