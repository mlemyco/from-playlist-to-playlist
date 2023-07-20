import React, { ForwardedRef, forwardRef } from 'react'
import Image from 'next/image'
import Dropdown from './dropdown'
import { motion } from 'framer-motion'

type Props = {
    children: React.ReactNode
    currentState: PlatformState
    setState: Function
}

const Platform = ({ children, currentState, setState }: Props) => {
    return (
        <div className='grid grid-rows-2 items-center py-5 min-h-full'>
            <img src={
                    currentState.platform == "youtube" ? 
                        "https://freelogopng.com/images/all_img/1656501415youtube-png-logo.png" 
                        :
                        "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
                } 
                alt=""
                className='max-w-xs'
            />
            
            {children}
            
            <Dropdown currentState={currentState} setState={setState} />
        </div>
    )
}
 
export default Platform;