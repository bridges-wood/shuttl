import Footer from '@components/Footer'
import Header from '@components/Header'
import { AppProps } from 'next/app'
import React from 'react'
import '../styles.css'

const MyApp = ({Component, pageProps} : AppProps) => {
  return (<React.Fragment>
    <Header/>
    <Component {...pageProps}/>
    <Footer/>
  </React.Fragment>)}

export default MyApp