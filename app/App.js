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

const AppContainer = styled(AragonApp)`
  display: block;
  align-items: flex-start;
  justify-content: flex-start;
`

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state={
      requestCount: 0,
      minimumDeposit:0,
      currentOwners: [],
      futureOwners: []
    }
  };

  getCurrentOwners = () => {
    new Promise(resolve => {
      this.props.app
      .call('getCurrentOwners', 0)
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


   getRequestsCount = () => {
    new Promise(resolve => {
      this.props.app
        .call('getRequestsCount')
        .first()
        .map(value => parseInt(value, 10))
        .subscribe(resolve)
    }).then(value => this.setState({
       requestCount: value
    }));
  };

  createRequest = () =>{
    this.props.app.createRequest("ownership", "AA", 0, "0xb70C6104d8b54041cA4d7bEf25050EE940386cC9");
  }

  componentDidMount = () => {
    this.getCurrentOwners();
    this.getFutureOwners();
    this.getRequestsCount();
  };

  render() {
        return (
            <AppContainer>
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
                        <Text>Request Count: {this.state.requestCount}</Text>
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
                    </div>
                </div>
            </AppContainer>
        )
    }
}

const ObservedCount = observe(
    (state$) => state$,
    {count: 0}
)(
    ({count}) => <Text.Block style={{textAlign: 'center'}} size='xxlarge'>{count}</Text.Block>
)
