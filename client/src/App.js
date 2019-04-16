import React, { Component } from 'react';
import Welcome from './pages/Welcome/Welcome'


class App extends Component {
  constructor(){
    super()

    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleCreateClick = this.handleCreateClick.bind(this)
  }

  handleLoginClick() {
    console.log('login clicked');
  }
  handleCreateClick() {
    console.log('create account clicked');
  }

  render() {
    return (
      <div className="app">
        <Welcome 
          onLoginClick={this.handleLoginClick} 
          onCreateClick={this.handleCreateClick} 
        />
      </div>
    );
  }
}

export default App;
