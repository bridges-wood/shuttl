import Footer from '@components/Footer'
import Header from '@components/Header'
import { AppProps } from 'next/app'
import React from 'react'
import '../scss/main.scss'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <React.Fragment>
      <div className="bg">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
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
