import React from 'react';
import SendMailScreenComponent from './SendMailScreen/SendMailScreenComponent';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';  

function App() {
  return (
    <div>
      <Header/>
      <div>
        <SendMailScreenComponent/>
      </div>


    </div>
  );  
}


export default App;