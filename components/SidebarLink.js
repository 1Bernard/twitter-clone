import React from 'react'

function SidebarLink({Icon, text, active}) {
  return (
    <div className={`text-[hsl(0,0%,2%)] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${active && 'font-bold'}`}>
        <Icon className='h-7' />
        <span className='hidden xl:inline'>{text}</span>
    </div>
  )
}

export default SidebarLink