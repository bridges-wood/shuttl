import Footer from '@components/Footer'
import Header from '@components/Header'
import StarField from '@components/StarField'
import { Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { AppProps } from 'next/app'
import React from 'react'
import '../scss/main.scss'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <React.Fragment>
      <div className="bg">
        <Canvas>
          <StarField />
        </Canvas>
        <Loader />
      </div>
      <div className="content-wrapper">
        <Header />
        <Component {...pageProps} />
      </div>
      <Footer />
    </React.Fragment>
  )
}

export default MyApp
