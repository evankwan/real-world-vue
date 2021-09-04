import Vue from "vue";
import Vuex from "vuex";
import EventService from '@/services/EventService.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: { id: "abc123", name: "Evan Kwan" },
    categories: ['sustainability', 'nature', 'animal welfare', 'housing', 'education', 'food', 'community'],
    events: [],
    totalPages: 1,
    event: {},
  },
  mutations: {
    ADD_EVENT(state, payload) {
      state.events.push(payload);
    },
    SET_EVENTS(state, payload) {
      state.events = payload;
    },
    SET_TOTAL_PAGES(state, payload) {
      state.totalPages = payload;
    },
    SET_EVENT(state, payload) {
      state.event = payload;
    }
  },
  actions: {
    createEvent({ commit }, payload) {
      return EventService.postEvent(payload).then(() => {
        commit('ADD_EVENT', payload);
      });
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          const totalPages = Math.ceil(response.headers['x-total-count'] / perPage);
          commit('SET_EVENTS', response.data);
          commit('SET_TOTAL_PAGES', totalPages);
        })
        .catch(error => {
          console.log("Error");
        });
    },
    fetchEvent({ commit, getters }, id) {
      const event = getters.getEventById(id);
      if (event) {
        commit('SET_EVENT', event);
      } else {
        EventService.getEvent(id)
          .then((response) => {
            commit('SET_EVENT', response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  },
  getters: {
    catLength: state => {
      return state.categories.length
    },
    getEventById: state => id => {
      return state.events.find(event => event.id === id)
    }
  },
});
