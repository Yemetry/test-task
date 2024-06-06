<template>
  <div class="relative cursor-pointer">
    <div
      class="flex items-center input text"
      :class="
        selectedCurrencyData && selectedCurrencyData.name !== selectedCurrencyData.network
          ? 'p-[5px]'
          : 'p-2'
      "
      @click="cdsModal"
    >
      <img v-if="selectedCurrencyData" :src="selectedCurrencyData.icon" class="w-6 h-6 mr-1" />
      <div class="flex flex-col">
        <span
          v-if="selectedCurrencyData && selectedCurrencyData.name !== selectedCurrencyData.network"
          class="text-primary text-[6px]"
          >{{ selectedCurrencyData.network }}</span
        >
        <span class="mr-2 text-[14px]">{{
          selectedCurrencyData ? selectedCurrencyData.name : 'Выберите криптовалюту'
        }}</span>
      </div>
      <svg
        class="w-3 h-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <div
      v-if="isOpen"
      v-on-click-outside="closeModal"
      class="w-[265px] absolute bg-white border py-2 z-10 text rounded-md right-0"
    >
      <div class="px-2">
        <div class="py-2">
          <span>Выберите криптовалюту</span>
        </div>
        <div class="relative mb-2">
          <input
            v-model="filter"
            class="input p-2 rounded-md focus-visible:outline-0"
            placeholder="Название валюты..."
            @input.stop
          />

          <img
            src="../assets/search.png"
            class="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
        </div>
        <div class="flex justify-around mb-2">
          <button
            v-for="button in buttons"
            :key="button.category"
            :class="[
              'category-button',
              { 'border border-border-gray': selectedCategory === button.category }
            ]"
            :style="button.style"
            @click="setCategory(button.category)"
          >
            {{ button.label }}
          </button>
        </div>
      </div>
      <ul class="max-h-40 overflow-y-auto custom-scrollbar pl-2">
        <li
          v-for="currency in filteredCurrencies"
          :key="currency.index"
          class="p-2 py-3 justify-between hover:bg-gray-100 cursor-pointer flex items-center mb-1.5 mr-1.5 border-2 rounded-md last:mb-0"
          @mousedown.prevent="selectCurrency(currency)"
        >
          <div class="flex items-center">
            <img :src="currency.icon" class="w-6 h-6 mr-2" />
            <span class="text-[14px]">{{ currency.name }}</span>
            <span
              v-if="currency.name !== currency.network"
              class="text-primary text-[8px] ml-1.5 px-1.5 border-[0.5px] border-light-gray bg-bg-light rounded-[50px]"
              >{{ currency.network }}</span
            >
          </div>
          <div dir="rtl" class="flex flex-col">
            <span class="text-dark-gray text-[10px] text-right">{{ currency.full_name }}</span>
            <span
              v-if="currency.name !== currency.network"
              class="text-middle-gray text-[8px] text-right"
              >{{ currency.full_network }}</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCurrencyStore } from '../stores/counter.js'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps({
  modelValue: String,
  excludedCurrency: String
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const filter = ref('')
const selectedCategory = ref('')
const buttons = ref([
  { label: 'Все', category: '', style: 'width: 53px;' },
  { label: 'Стейблкоины', category: 'Stablecoin', style: ' width: 88px;' },
  { label: 'Классика', category: 'Classic', style: ' width: 88px;' }
])

const store = useCurrencyStore()

const selectedCurrencyData = computed(() => {
  return store.currencies.find((currency) => currency.code === props.modelValue)
})

const filteredCurrencies = computed(() => {
  const filtered = store.currencies
    .filter((currency) => currency.code !== props.excludedCurrency)
    .filter((currency) => {
      const matchesFilter = currency.full_name.toLowerCase().includes(filter.value.toLowerCase())

      return matchesFilter
    })

  const stableCoins = filtered.filter((currency) => currency.is_stablecoin)
  const popularCurrencies = filtered.filter((currency) => currency.is_popular)

  if (selectedCategory.value === 'Stablecoin') {
    return stableCoins
  }
  if (selectedCategory.value === 'Classic') {
    return popularCurrencies
  }
  return filtered
})

const selectCurrency = (currency) => {
  emits('update:modelValue', currency.code)
  isOpen.value = false
}
const closeModal = () => {
  isOpen.value = false
}

const cdsModal = () => {
  isOpen.value = !isOpen.value
}
const setCategory = (category) => {
  selectedCategory.value = category
}

onMounted(() => {
  if (store.currencies.length === 0) {
    store.fetchCurrencies()
  }
})
</script>

<style scoped lang="scss">
.input {
  border: 1px solid #f0f0f0;

  width: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f3f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #bfbcdd;
    border-radius: 10px;
  }
}
.category-button {
  background-color: #f1f3f9;
  font-size: 10px;
  cursor: pointer;
  padding: 4px 8px 4px 8px;
  border-radius: 50px;

  height: 24px;
}
</style>
