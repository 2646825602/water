import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        token: null,
    },
    mutations: {
        setToken(state, payload) {
            console.log(state.token);
            state.token = payload;
        },
    },
    actions: {
        isLoggedIn({ state }) {
            return state.token !== null;
        },
    },
    getters: {
        isLoggedIn({ state }) {
            return state.token !== null;
        }
    }
})