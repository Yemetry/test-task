import { defineStore } from 'pinia'
import axios from 'axios'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currencies: [],
    isLoading:false

  }),
  actions: {
    async fetchCurrencies() {
      const response = await axios.get('https://api-exchange.cryptocloud.plus/exchange/all_currency')
      this.currencies = response.data
    },
    async convertToCurrency(amount, fromCurrency, toCurrency) {
      try {
      this.isLoading = true
      const response = await axios.post('https://api-exchange.cryptocloud.plus/exchange/profit_amount', {
        amount,
        from_float: fromCurrency,
        to_float: toCurrency,
      })
      return response.data

      }finally {

      this.isLoading = false
      }
    },
    async convertFromCurrency(amount, fromCurrency, toCurrency) {
      try{
      this.isLoading = true
      const response = await axios.post('https://api-exchange.cryptocloud.plus/exchange/profit_amount', {
        amount,
        from_fixed: fromCurrency,
        to_fixed: toCurrency,
      })
      return response.data

      }finally {
      this.isLoading = false

      }
    },
  },
})
