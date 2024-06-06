<template>
  <div
    class="xs:max-w-6xl max-w-full xs:flex py-12 pt-4 xs:p-12 rounded-[20px] max-xs:h-5/6 bg-bg-card"
  >
    <div class="w-full px-4 xs:w-1/2">
      <h2 class="xs:w-5/6 xs:text-4xl w-10/12 text-2xl font-bold mb-4 text-secondary">
        Обмен криптовалюты <span class="text-primary">без ограничений</span>
      </h2>
      <p class="text-accent xs:w-8/12 w-11/12">
        Обменивайте Bitcoin, Litecoin, Ethereum, Tether и более 50 альткоинов быстрым, простым и
        безопасным способом.
      </p>
      <div class="flex space-x-4 max-xs:hidden">
        <img class="w-max h-max" src="../assets/img.png" alt="" />
      </div>
    </div>
    <div class="xs:w-[40%] h-5/6 xs:mt-0 mt-5 w-full">
      <div class="bg-white xs:p-8 p-4 py-6 rounded-[20px] shadow-[0px_5px_50px_-5px_#0F0F0F0D]">
        <div>
          <p
            class="xs:w-[17rem] xs:text-2xl text-lg/[21px] w-[13rem] text-secondary font-semibold mb-4"
          >
            Введите сумму обмена и выберите валюты
          </p>
          <label
            for="fromAmount"
            class="sm:text-sm/6 block text-accent xs:text-dark-gray text-[12px]/6 mb-1.5"
            >Вы отдаете</label
          >
          <div class="relative w-full">
            <input
              id="fromAmount"
              v-select
              v-debounce:2s="calculateToAmount"
              :value="fromAmountComp"
              type="text"
              :placeholder="'0,00 ' + fromCurrency"
              class="p-2 border-[1px] border-solid border-light-gray rounded-md focus-visible:outline-0 w-full"
              @input="setFromAmount"
              @focus="onInputFromFocus"
            />
            <div class="absolute right-0 top-0 bottom-0 flex items-center">
              <CurrencySelector v-model="fromCurrency" :excluded-currency="toCurrency" />
            </div>
          </div>
        </div>
        <div class="justify-end flex">
          <button :class="store.isLoading ? 'pointer-events-none opacity-50' : ''" @click="swap">
            <img src="../assets/swap.png" class="mt-4 w-6 h-6" />
          </button>
        </div>
        <div>
          <label
            for="toAmount"
            class="sm:text-sm/6 block text-accent xs:text-dark-gray text-[12px]/6 text"
            >Вы получаете</label
          >
          <div class="flex items-center space-x-2 mt-1">
            <div class="relative w-full">
              <input
                id="toAmount"
                v-select
                v-debounce:2s="calculateFromAmount"
                :value="toAmountComp"
                type="text"
                :placeholder="'0,00 ' + toCurrency"
                class="p-2 border-[1px] border-light-gray rounded-md focus-visible:outline-0 w-full"
                @input="setToAmount"
                @focus="onInputFocus"
              />
              <div class="absolute right-0 top-0 bottom-0 flex items-center">
                <CurrencySelector v-model="toCurrency" :excluded-currency="fromCurrency" />
              </div>
            </div>
          </div>
        </div>
        <button class="mt-10 mb-3 w-full py-3 bg-primary text-white rounded-full text">
          Продолжить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useCurrencyStore } from '../stores/counter.js'
import CurrencySelector from './CurrencySelector.vue'
import CustomInput from '@/components/UI/InputNumber.vue'
import { vueDebounce } from 'vue-debounce'

const vDebounce = vueDebounce({ lock: true })

const fromAmount = ref(0)
const toAmount = ref(0)
const fromCurrency = ref('BTC')
const toCurrency = ref('ETH')

const store = useCurrencyStore()

const toAmountComp = computed(() => {
  return parseFloat(String(toAmount.value)) + ` ${toCurrency.value}`
})

const fromAmountComp = computed(() => {
  return parseFloat(String(fromAmount.value)) + ` ${fromCurrency.value}`
})

const onInputFocus = (e) => {
  toAmount.value = parseFloat(e.target.value.split(' ')[0])
}
const onInputFromFocus = (e) => {
  fromAmount.value = parseFloat(e.target.value.split(' ')[0])
}

const setToAmount = (e) => {
  setTimeout(() => (toAmount.value = parseFloat(e.target.value.split(' ')[0])), 2000)
}
const setFromAmount = (e) => {
  setTimeout(() => (fromAmount.value = parseFloat(e.target.value.split(' ')[0])), 2000)
}

const calculateToAmount = async () => {
  if (!fromAmount.value || !fromCurrency.value || !toCurrency.value) return

  const result = await store.convertToCurrency(
    parseFloat(fromAmount.value),
    fromCurrency.value,
    toCurrency.value
  )
  toAmount.value = result.profit_rate.toFixed(4)
}

const calculateFromAmount = async () => {
  if (!toAmount.value || !fromCurrency.value || !toCurrency.value) return

  const result = await store.convertFromCurrency(
    parseFloat(toAmount.value),
    fromCurrency.value,
    toCurrency.value
  )
  fromAmount.value = result.profit_rate.toFixed(4)
}

const swap = () => {
  if (
    fromAmount.value !== undefined &&
    toAmount.value !== undefined &&
    fromCurrency.value &&
    toCurrency.value
  ) {
    ;[fromAmount.value, toAmount.value] = [toAmount.value, fromAmount.value]
    ;[fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value]
  }
}

watch([toCurrency, fromCurrency], calculateToAmount)
</script>

<style scoped lang="scss">
input[type='text']::-webkit-outer-spin-button,
input[type='text']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='text'] {
  -moz-appearance: textfield;
}
</style>
