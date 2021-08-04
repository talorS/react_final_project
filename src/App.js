import logo from './logo.svg';
import './App.css';
import {Component} from 'react'
import HostComp from './appHost'

class App extends Component {
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div> 
       <HostComp/>
      </div>
    )
  }
 }

export default App;
