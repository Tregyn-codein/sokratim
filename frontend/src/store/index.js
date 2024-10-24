import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: false,
    token: '',
  },
  getters: {
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    refreshToken(state) {
      axios.post('/api/token/refresh', {
        token: state.token,
      })
          .then(response => {
            state.token = response.data.token;
          })
          .catch(error => {
            // обработайте ошибку
          });
    },
  },
  actions: {
    async refreshToken({ commit, state }) {
      if (state.tokenExpiresIn < 60) {
        commit('refreshToken');
      }
    },
  },
  modules: {
  }
})
