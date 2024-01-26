import { createStore, action } from 'easy-peasy';

export default createStore({
    showModal: false,
    setShowModal: action((state, payload) => {
        state.showModal = payload
    })
})