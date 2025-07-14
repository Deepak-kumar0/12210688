import React from 'react'
import Style from './Navbar.module.css';

export default function Navbar() {
  return (
    <navbar>
       <nav>
         <a href="/">URL shortener</a>
         <a href="/statistics">Statistics</a>
       </nav>
    </navbar>
  )
}
