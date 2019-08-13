import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/*
starting year for the game
*/
const BASE_YEAR = 1900;

const MONTHS = ["January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"];

/*
Ports. For now ports just have names but I may add boosts later, like port
X for good Y is good.
*/
const PORTS = [
  {
    name:'Bespin'
  },
  {
    name:'Dagobah'
  },
  {
    name:'Naboo'
  },
  {
    name:'Coruscant'
  },
  {
    name:'New Boston'
  }
];

/*
Goods have a value range representing, generally, what they will sell for.
illegal=true means there is a chance it will be stolen
*/
const GOODS = [
  {
    name:'General',
    salesRange: [5, 20],
    illegal:false
  },
  {
    name:'Arms',
    salesRange: [60, 120],
    illegal:false
  },
  {
    name:'Silk',
    salesRange: [200, 500],
    illegal:false
  },
  {
    name:'Spice',
    salesRange: [3000, 6000],
    illegal:true
  }

];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default new Vuex.Store({
  state: {
    name:'',
    port:null,
    money:10000,
    turn:0,
    holdSize:100,
    hold:[],
    prices: [],
    damage:0
  },
  mutations: {
    /*
    called for a new game
    */
    bootstrap(state) {
      state.port = PORTS[0];
      GOODS.forEach(g => {
        state.hold.push({name:g.name, quantity: 0});
      });
    },
    newTurn(state) {
      state.turn++;
      state.prices = [];
      GOODS.forEach(g => {
        let goodPrice = getRandomInt( g.salesRange[0], g.salesRange[1] );
        state.prices.push({name:g.name, price: goodPrice });
      });

    },
    purchase(state, order) {
      console.log('try to buy '+order.good.name + ' amt '+order.qty);
      let total = order.good.price * order.qty;
      if(total <= state.money) {
        state.hold.forEach((h,i) => {
          console.log('h is '+h);
          if(h.name === order.good.name) {
            state.hold[i].quantity += order.qty;
            state.money -= total;
          }
        });
      }
    },
    setName(state, name) {
      state.name = name;
    },
    setPort(state, idx) {
      state.port = PORTS[idx];
    }
  },
  getters: {
    gameDate(state) {
      let years = Math.floor((state.turn-1)/12);
      let month = (state.turn-1) % 12;
      return `${MONTHS[month]} ${BASE_YEAR + years}`;
    },
    goods() {
      return GOODS.map(g => { return g.name });
    },
    ports() {
      return PORTS.map(p => { return p.name });
    },
    shipUsedSpace(state) {
      let used = 0;
      state.hold.forEach(h => {
        used += h.quantity;
      });
      return used;
    }
  },
  actions: {

  }
})
