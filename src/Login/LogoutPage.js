import {connect} from 'react-redux'
import { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { USER_AUTH } from '../Utils/UserAuth';

class LogOutComp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    sessionStorage.clear();
    USER_AUTH.remove();
    this.props.dispatch({type : "USER_LOGOUT"});
  }

  render() {
    return (
        <Redirect to='/' />
    )
  }
}
//HOC
export default connect()(LogOutComp);
