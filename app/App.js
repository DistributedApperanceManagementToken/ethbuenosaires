import React from 'react'
import {
    AragonApp,
    Button,
    Text,
    Card,
    AppBar,
    observe,
    SidePanel,
    TextInput
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
      request:[],
      sidePanelOpen:false,
      description:'',
      amount:0,
      address:'',
      panelTitle:'',
      approvedRequest: false,
      groupName:'',
      balance:0
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

  getRequest = (index) => {
    new Promise(resolve => {
      this.props.app
      .call('requests',index)
      .first()
      .subscribe(resolve)
    }).
    then(value => {
      let array = this.state.request;
      array.push(value);``
      this.setState({request:array});
      console.log("ARREGLO",array);
    });
  };

  getWalletSummary = () => {
    new Promise(resolve => {
      this.props.app
      .call('getWalletSummary')
      .first()
      .subscribe(resolve)
    }).
    then(value => {
      this.setState({groupName:value[0], balance:value[1], minimumDeposit: value[2]})
    });
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
    setTimeout(()=>{this.getRequestsCount(); this.getWalletSummary();}, 5000);
  };

  renderList = (requestCount, approvedRequest) =>{

     if (requestCount && requestCount > this.state.requestCount) {
       for (let i=0; i<requestCount; i++) {
         this.getRequest(i);
       }
       this.setState({requestCount});
     }
  }

  openTransferRequest = () =>{
    this.setState({sidePanelOpen:true, panelTitle:"Propose Transfer"});
    let objective = document.getElementById("objective");
    let sidepanel = document.getElementById("sidepanel");
    let amount = document.getElementById("amount");
    amount.style.display="inline";
    objective.value="transfer";
  }

  openMemberRequest = () =>{
    this.setState({sidePanelOpen:true, panelTitle:"Propose New Owner"});
    let objective = document.getElementById("objective");
    let sidepanel = document.getElementById("sidepanel");
    let amount = document.getElementById("amount");
    amount.style.display="none";
    objective.value="ownership";
  }

  addMoney = () =>{
    this.setState({sidePanelOpen:true, panelTitle:"Add Money"});
    let objective = document.getElementById("objective");
    let sidepanel = document.getElementById("sidepanel");
    let recipient = document.getElementById("recipient");
    recipient.style.display="none";
    objective.value="ownership";

  }

  submitRequest =()=>{
    let description = document.getElementById("description").value;
    let amount = document.getElementById("amount").value;
    let recipient = document.getElementById("recipient").value;
    let objective = document.getElementById("objective").value;

    if(this.state.panelTitle==="Add Money"){
      this.props.app.deposit(amount);
      this.setState({sidePanelOpen:false});
      return;
    }

    console.log(objective,description,amount,recipient);
    this.props.app.createRequest(objective,description,amount,recipient);
    this.setState({sidePanelOpen:false});

  }

  approveRequest = (index) => {
      this.props.app.approveRequest(index);
  }

  finalizeRequest = (index) => {
      this.props.app.finalizeRequest(index);
  }

  render() {
        console.log(this.state);
        return (
            <AppContainer observable={this.observable}>
                <div>
                    <AppBar title="Collective Wallet">
                         <div style={{position: 'absolute', right: 15}}>
                         <Button mode="strong" style={{marginRight: 10}} onClick={() => this.addMoney()}>Add money</Button>
                         <Button mode="strong" style={{marginRight: 10}} onClick={() => this.openMemberRequest()}>Request Add Member</Button>
                         <Button mode="strong" style={{marginRight: 10}} onClick={() => this.openTransferRequest()}>Request New Transfer</Button>

                        </div>
                    </AppBar>
                    <div style={{position:"relative",marginTop:20}}>
                       <div style={{margin: "-5px 15px 0px 15px"}}>
                           <Text style={{margin: 15, fontSize:14}}>Name: ETH Buenos Aires</Text>
                           <Text style={{margin: 15, fontSize:14}}>Minimum Deposit: 10</Text>
                       </div>

                       <br/>
                       <Text style={{fontWeight: "bold", margin:20, position:'absolute',right:15, fontSize:28}}>Balance: {this.props.balance}</Text>
                       <Text style={{fontWeight: "bold", margin:20, fontSize:28}}>Wallet Requests</Text>
                   </div>

                    {this.renderList(this.props.requestCount, this.props.approvedRequest)}


                    <div style={{justifyContent: "center", margin: 20}}>
                    {this.state.request.map((request,index)=>{
                      let cardType= request[0]=="ownership"?"New Owner Request":"Transfer Request";
                      return(
                      <Card style={{marginBottom: 10, padding: 20}} width="100%" height="100px">
                          <Text style={{fontWeight: "bold"}}>{cardType}: {request[1]}</Text>
                          <div>
                              <Text style={{marginRight: 20}}>Price: {request[3]}</Text>
                              <Text>Addresss: {request[4]}</Text>
                          </div>
                          {request[8] &&
                           <Text>Approved: {request[6]}/{request[7]}</Text>}
                           {!request[8] &&
                           <Button style={{float: "right", marginTop: "-40px"}} mode="strong" emphasis="positive" onClick={()=>this.approveRequest(index)} >APROVE</Button>}
                           {(request[6]>request[7]/2) &&
                           <Button style={{float: "right", marginTop: "-40px"}} mode="strong" emphasis="positive" onClick={()=>this.finalizeRequest(index)} >FINALIZE</Button>}
                      </Card>);
                    })}
                    </div>
                    <SidePanel title={this.state.panelTitle} id="sidepanel" opened={this.state.sidePanelOpen} onClose={() => this.setState({sidePanelOpen: false})}>
                      <div>
                        <TextInput style={{marginBottom:10}} id="description" wide placeholder="Description"/><br/>
                        <TextInput style={{marginBottom:10}} id="amount" wide type="number" placeholder="Amount"/><br/>
                        <TextInput style={{marginBottom:10}} id="recipient" wide placeholder="Address To"/><br/>
                        <TextInput style={{marginBottom:10, display:"none"}} id="objective" wide placeholder="objective"/><br/>
                        <Button style={{marginTop: "20px"}} mode="strong" wide={true} onClick={this.submitRequest} >SUBMIT</Button>
                      </div>
                    </SidePanel>
                </div>
            </AppContainer>
        )
    }

}

export default observe(
  observable => observable.map(state => ({ ...state })),
  {requestCount: 0, approvedRequest:false, balance:0}
)(App)
