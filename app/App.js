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
    render() {
        return (
            <AppContainer>
                <div>
                    <AppBar title="Collective Wallet">
                         <div style={{position: 'absolute', right: 15}}>
                            <Button mode="strong" style={{marginRight: 10}} onClick={() => this.props.app.decrement(1)}>Request
                                New Member</Button>
                            <Button mode="strong" onClick={() => this.props.app.increment(1)}>Create New
                                Expense</Button>
                        </div>
                    </AppBar>
                    <div style={{position:"relative",marginTop:20}}>
                        <Text style={{fontWeight: "bold", margin:20, fontSize:28}}>Open Requests</Text>
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
