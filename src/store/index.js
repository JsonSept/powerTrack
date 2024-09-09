import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    // Existing state properties
    monthlyProduction: 0,
    monthlyConsumption: 0,
    unit: 0,
    sell: 0,
    dailyLabels: [],
    dailyProductionData: [],
    dailyConsumptionData: [],
    dayData: null,
    rate: 1,
    capacity: 0,
    energyUsed: 0,
    savedUnits: 0,
    totalMoneyEarned: 0,
    
    // Authentication state
    token: null,
    user: null,
  },
  
  mutations: {
    // Existing mutations
    SET_MONTHLY_PRODUCTION(state, value) {
      state.monthlyProduction = value;
    },
    SET_MONTHLY_CONSUMPTION(state, value) {
      state.monthlyConsumption = value;
    },
    SET_UNIT(state, value) {
      state.unit = value;
    },
    SET_SELL(state, value) {
      state.sell = value;
    },
    SET_DAILY_DATA(state, data) {
      state.dailyLabels = data.labels || [];
      state.dailyProductionData = data.production || [];
      state.dailyConsumptionData = data.consumption || [];
    },
    SET_DAY_DATA(state, data) {
      state.dayData = data;
    },
    SET_RATE(state, rate) {
      state.rate = rate;
    },
    SET_CAPACITY(state, capacity) {
      state.capacity = capacity;
    },
    SET_ENERGY_USED(state, energyUsed) {
      state.energyUsed = energyUsed;
    },
    SET_SAVED_UNITS(state, savedUnits) {
      state.savedUnits = savedUnits;
    },
    SET_TOTAL_MONEY_EARNED(state, totalMoneyEarned) {
      state.totalMoneyEarned = totalMoneyEarned;
    },
    
    // Authentication mutations
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  
  actions: {
    // Existing actions
    async fetchData({ commit, state }, selectedDay) {
      try {
        const response = await axios.get('https://backend-powertrack.onrender.com/daily');
        const dailyData = response.data;
        const formattedDay = `Day ${selectedDay}`;
        const dayData = dailyData.find(d => d.day === formattedDay);

        if (dayData) {
          const capacity = parseFloat(dayData.production.replace(' kWh', ''));
          const energyUsed = parseFloat(dayData.consumption.replace(' kWh', ''));
          const savedUnits = capacity - energyUsed;
          const totalMoneyEarned = state.rate * savedUnits;

          commit('SET_DAY_DATA', dayData);
          commit('SET_CAPACITY', capacity);
          commit('SET_ENERGY_USED', energyUsed);
          commit('SET_SAVED_UNITS', savedUnits);
          commit('SET_TOTAL_MONEY_EARNED', totalMoneyEarned);
        } else {
          console.warn(`Data for ${formattedDay} not found.`);
          commit('SET_DAY_DATA', null);
          commit('SET_CAPACITY', 0);
          commit('SET_ENERGY_USED', 0);
          commit('SET_SAVED_UNITS', 0);
          commit('SET_TOTAL_MONEY_EARNED', 0);
        }

        const labels = dailyData.map(item => item.day);
        const productionData = dailyData.map(item => parseFloat(item.production.replace(' kWh', '')));
        const consumptionData = dailyData.map(item => parseFloat(item.consumption.replace(' kWh', '')));
        commit('SET_DAILY_DATA', {
          labels,
          production: productionData,
          consumption: consumptionData,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
    
    async fetchInverterData({ commit }) {
      try {
        const response = await axios.get('https://backend-powertrack.onrender.com/inverter');
        const data = response.data[0];
        commit('SET_MONTHLY_PRODUCTION', parseFloat(data.monthly_production.replace(' kWh', '')));
        commit('SET_MONTHLY_CONSUMPTION', parseFloat(data.monthly_consumption.replace(' mWh', '')) * 1000);
        commit('SET_UNIT', parseFloat(data.unit.replace('R', '').trim()));
        commit('SET_SELL', parseFloat(data.sell.replace('R', '').trim()));
        await this.dispatch('fetchData', '1');
      } catch (error) {
        console.error('Error fetching inverter data:', error);
      }
    },
    
    calculateReturn({ commit, state }) {
      const savedUnits = state.capacity - state.energyUsed;
      const totalMoneyEarned = savedUnits * state.rate;
      commit('SET_TOTAL_MONEY_EARNED', totalMoneyEarned);
    },

    // Authentication actions
    async login({ commit }, payload) {
      try {
        const { appId, appSecret, countryCode, email, mobile, orgId, password, username } = payload;

        const data = {
          appSecret,
          countryCode,
          email,
          mobile,
          orgId,
          password,
          username,
        };

        const response = await axios.post('https://globalapi.solarmanpv.com/account/v1.0/token', data, {
          params: { appId },
          headers: { 'Content-Type': 'application/json' },
        });

        const token = response.data.token; 
        commit('setToken', token);
        commit('setUser', payload); 
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
  },
  
  getters: {
    // Existing getters (if any)
    
    // Authentication getters
    token: (state) => state.token,
    user: (state) => state.user,
  },
});