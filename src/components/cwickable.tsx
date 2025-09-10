import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/utils'

const Cwickablebutton = ({ 
  children, 
  className, 
  onClick 
}: { 
  children: React.ReactNode, 
  className?: string,
  onClick?: () => void
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={cn(
        "relative transition-all duration-200 [box-shadow:0_0_10px_-1px_#00000060] border border-black/50 rounded-2xl overflow-hidden bg-[#0A0A0A]",
        isPressed ? "after:[box-shadow:0_5px_15px_0_#00000090_inset] [box-shadow:0_0_5px_-1px_#00000040]" : "hover:after:[box-shadow:0_3px_10px_0_#00000070_inset]",
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      <div className={cn(
        "relative z-10 flex items-center justify-center p-0 transition-transform duration-200",
        isPressed ? "translate-y-1" : ""
      )}>
        {children}
      </div>
      <div 
        className={cn(
          "absolute inset-0 border-[#1A1A1A] border-t-[3px] border-b-[3px] border-b-black/50 border-r-0 rounded-2xl transition-all duration-200",
          isPressed ? "border-b-0 border-t-black/50" : ""
        )}
      />
    </button>
  )
}

const CwickablebuttonDemo = () => {

  return (
    <> 
          <Cwickablebutton className='px-8 py-8 text-xl mb-8'>
            <Image
              src={`/vercel.svg`}
              alt={`incel`}
              width={15}
              height={15}
              className="w-16"
            />
          </Cwickablebutton>
    </>
  )
}

export default CwickablebuttonDemo