import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './Pages/Home/Home';
import ShortLinkRedirector from './Pages/ShortLinkRedirector/ShortLinkRedirector';
function App() {
  
  return (
  <div>
   
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home/>}></Route>
         <Route path="/s/:shortcode" element={<ShortLinkRedirector/>} />
         <Route path='/*' element={<p>Page Not Found</p>}/>
    </Routes>
    </BrowserRouter>
  </div>  
  )
}


export default App;
