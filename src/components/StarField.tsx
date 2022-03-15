import { Stars } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useCallback, useEffect } from 'react';

const StarField = () => {
  const {camera} = useThree()

  const scrollCallback = useCallback(() => {
    const scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const rotation = ((scrollMaxY - window.scrollY) / scrollMaxY) * Math.PI /2  
    camera.rotation.set(0, ((scrollMaxY - window.scrollY) / scrollMaxY), 0)
    // document.getElementsByClassName('bg')[0].style.backgroundPosition = `${-window.scrollY / 10}px`
    
    console.log(window.scrollY  )
  }, [camera])
  

  useEffect(() => {
    window.addEventListener('scroll', scrollCallback)
  
    return () => {
      window.removeEventListener('scroll', scrollCallback)
    };
  },[scrollCallback])

  return (
      <Stars fade factor={6}/>
  )
};

export default StarField