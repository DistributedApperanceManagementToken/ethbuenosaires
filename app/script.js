import Aragon from '@aragon/client'

const app = new Aragon()

const initialState = {
  count: 0,
  requestCount: 0
}

app.store(async (state, event) => {
  if (state === null) state = initialState;
  switch (event.event) {
    case "CreateRequest":
      let requestCount =  await getCreateState();
      return {requestCount: requestCount, approvedRequest: false};
    case "ApproveRequest":
      return {requestCount: await getCreateState(), approvedRequest: true};
    case "FinalizeRequest":
      return {requestCount: await getCreateState()};
    case "Deposit":
      return {balance: await getWalletSummary()};
    default:
      return state;
  }
})

function getCreateState(){
  return new Promise(resolve => {
    app
    .call('getRequestsCount')
    .first()
    .map(value=> parseInt(value,10))
    .subscribe(resolve)
})};

getWalletSummary = () => {
  new Promise(resolve => {
    this.props.app
    .call('getWalletSumary')
    .first()
    .map(value => parseInt(value[1],10))
    .subscribe(resolve)
  })
};
