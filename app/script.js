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
      return {requestCount: requestCount};
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
