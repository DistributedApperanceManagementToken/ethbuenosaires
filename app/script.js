import Aragon from '@aragon/client'

const app = new Aragon()

const initialState = {
  count: 0,
  requestCount: 0
}
app.store(async (state, event) => {
  if (state === null) state = initialState;
  switch (event.event) {
    default:
      return state;
  }
})
