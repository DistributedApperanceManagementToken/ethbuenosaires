import React from 'react'
import {
    AragonApp,
    Button,
    Text,
    Card,
    AppBar,
    observe
} from '@aragon/ui'
import Aragon, {providers} from '@aragon/client'
import styled from 'styled-components'
import { Button as SButton } from 'semantic-ui-react'

const AppContainer = styled(AragonApp)`
  display: block;
  align-items: flex-start;
  justify-content: flex-start;
`

class App extends React.Component {

  constructor(props){
    super(props);
    this.state={
      requestCount: 0,
      minimumDeposit:0,
      currentOwners: [],
      futureOwners: [],
      request:false
    }
  };

  getCurrentOwners = () => {
    new Promise(resolve => {
      this.props.app
      .call('getCurrentOwners')
      .first()
      .subscribe(resolve)
    }).then(value => {
      this.setState({currentOwners: value},console.log(this.state.currentOwners));
  })};

  getFutureOwners = () => {
    new Promise(resolve => {
      this.props.app
      .call('getFutureOwners')
      .first()
      .subscribe(resolve)
    }).then(value => this.setState({
      futureOwners: value
    }));
  };

  getRequest = () => {
    new Promise(resolve => {
      this.props.app
      .call('requests')
      .first()
      .subscribe(resolve)
    }).then(value => this.setState({
      requests: value
    }));
  };

   getRequestsCount = () => {
    new Promise(resolve => {
      this.props.app
        .call('getRequestsCount')
        .first()
        .map(value => parseInt(value, 10))
        .subscribe(resolve)
    }).then(value => {
      this.setState({requestCount: value});
    });
  };

  createRequest = () =>{
    this.props.app.createRequest("ownership", "AA", 0, "0xb70C6104d8b54041cA4d7bEf25050EE940386cC9");
  }

  componentDidMount = () => {
    console.log('componentDidMount');
    setTimeout(this.getRequestsCount, 5000);
  };

  componentWillReceiveProps(nextProps){
    console.log("NEXT PROPS");
  }
  render() {
        console.log(this.state);
        return (

            <AppContainer observable={this.observable}>
                <div>
                    <AppBar title="Collective Wallet">
                         <div style={{position: 'absolute', right: 15}}>
                            <Button mode="strong" style={{marginRight: 10}} onClick={() => this.getCurrentOwners()}>Request
                                New Member</Button>
                            <Button mode="strong" style={{marginRight: 10}} onClick={() => this.createRequest()}>Create
                                New Request</Button>
                        </div>
                    </AppBar>
                    <div style={{position:"relative",marginTop:20}}>

                        <Text style={{fontWeight: "bold", margin:20, fontSize:28}}>Open Requests</Text>
                        <Text>Minimum Deposit: {this.state.minimumDeposit}</Text>
                        <Text>Request Count: {this.state.getFutureOwners}</Text>
                        <Text>Props: {this.props.requestCount}</Text>
                    </div>
                    <div style={{justifyContent: "center", margin: 20}}>
                        <Card style={{marginBottom: 10, padding: 20}} width="800px" height="85px">
                            <Text style={{fontWeight: "bold"}}>Compra de baterias</Text>
                            <div>
                                <Text style={{marginRight: 20}}>Precio: 0.1ETH</Text>
                                <Text>Addresss: 0x182hb23h2h3j2h3j2</Text>
                            </div>
                        </Card>
                        <Card style={{marginBottom: 10, padding: 20}} width="800px" height="85px">
                            <Text style={{fontWeight: "bold"}}>Compra de baterias</Text>
                            <div>
                                <Text style={{marginRight: 20}}>Precio: 0.1ETH</Text>
                                <Text>Addresss: 0x182hb23h2h3j2h3j2</Text>
                            </div>
                        </Card>
                        <SButton primary>Primary</SButton>
                    </div>
                </div>
            </AppContainer>
        )
    }

}

export default observe(
  observable => observable.map(state => ({ ...state })),
  {requestCount: 0}
)(App)
