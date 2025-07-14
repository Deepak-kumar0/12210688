import React from 'react'
import Style from './Home.module.css';
import Navbar from '../Navbar/Navbar';
import ShortenerForm from '../ShortenerForm/ShortenerForm';

export default function Home() {
  return (
    <>
      <Navbar/>
      <ShortenerForm/>
    </>
  )
}
