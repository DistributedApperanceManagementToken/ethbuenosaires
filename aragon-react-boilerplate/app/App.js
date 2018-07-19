import React from 'react'
import {
    AragonApp,
    Button,
    Text,
    observe,
    AppBar,
    Card,
    SidePanel
} from '@aragon/ui'
import Aragon, {providers} from '@aragon/client'
import styled from 'styled-components'

const AppContainer = styled(AragonApp)`
  display: block;
  align-items: flex-start;
  justify-content: flex-start;
`

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            requestCount: [],
            request: [],
            sidePanelOpen: false
        }
    };

    getRequestsCount = () => {
        new Promise(resolve => {
            this.props.app
                .call('getRequestsCount')
                .first()
                .subscribe(resolve)
        }).then(value => {
            this.setState({requestCount: value}, () => console.log(this.state.requestCount))
        });
    };

    getRequest = (index) => {
        new Promise(resolve => {
            this.props.app
                .call('getRequest', index)
                .first()
                .subscribe(resolve)
        }).then(value => {
            console.log(value)
            this.setState({request: value})
        });
    };

    componentDidMount = () => {
        this.getRequestsCount();
    };

    render() {
        return (
            <AppContainer>
                <div>
                    <AppBar title="Collective Wallet">
                        <div style={{position: 'absolute', right: 15}}>
                            <Button mode="strong" style={{marginRight: 10}} onClick={() => this.getCurrentOwners()}>Request Add Member</Button>
                            <Button mode="strong" style={{marginRight: 10}} onClick={() => this.setState({sidePanelOpen: true})}>Request New Transfer</Button>
                        </div>
                    </AppBar>
                    <div style={{position:"relative",marginTop:20}}>
                        <div style={{margin: "-5px 15px 0px 15px"}}>
                            <Text style={{margin: 15, fontSize:14}}>Name: ETH Buenos Aires</Text>
                            <Text style={{margin: 15, fontSize:14}}>Minimum Deposit: 0.001 ETH</Text>
                        </div>
                        <br/>
                        <Text style={{fontWeight: "bold", margin:20, fontSize:28}}>Wallet Requests</Text>
                    </div>
                    <div style={{justifyContent: "center", margin: 20}}>
                        <Card style={{marginBottom: 10, padding: 20}} width="100%" height="100px">
                            <Text style={{fontWeight: "bold"}}>Transfer Request</Text>
                            <div>
                                <Text style={{marginRight: 10}}>Description: New computer for the house</Text>
                                <Text style={{marginRight: 20}}>Amount: 0.1ETH</Text><br/>
                                <Text style={{marginRight: 20}}>To: 0x182hb23h2h3j2h3djndjj2</Text>
                                <Text style={{marginRight: 20}}>Requested By: 0x14321423424b23h2h3j2h3j2</Text>
                            </div>
                            <Button style={{float: "right", marginTop: "-40px"}} mode="strong" emphasis="positive">APROVE</Button>
                        </Card>
                        <Card style={{marginBottom: 10, padding: 20}} width="100%" height="100px">
                            <Text style={{fontWeight: "bold"}}>New Owner Request</Text>
                            <div>
                            <Text style={{marginRight: 10}}>Description: New computer for the house</Text><br/>
                            <Text style={{marginRight: 30}}>Addresss: 0x182hb23h2h3j2h3djndjj2</Text>
                            <Text style={{marginRight: 30}}>Requested By: 0x14321423424b23h2h3j2h3j2</Text>
                            </div>
                            <Button style={{float: "right", marginTop: "-40px"}} mode="strong" emphasis="positive">APROVE</Button>
                        </Card>
                    </div>
                    <SidePanel title="Propose Payment" opened={this.state.sidePanelOpen} onClose={() => this.setState({sidePanelOpen: false})}>
                        {/* form inputs */}
                    </SidePanel>
                    <div style={{display: 'none'}}>
                        <ObservedCount observable={this.props.observable}/>
                        <Button onClick={() => this.getRequestsCount()}>GET REQUESTS</Button>
                        <Button onClick={() => this.getRequest(0)}>GET REQUEST</Button>
                        <Button onClick={() => this.props.app.createRequest("ownership", "AA", 0, "0xb70C6104d8b54041cA4d7bEf25050EE940386cC9")}>CREATE</Button>
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
