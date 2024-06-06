<template>
  <input
    v-select
    id="toAmount"
    :value="toAmountComp"
    @input="setRotation"
    v-debounce:1s="calculateFromAmount"
    type="text"
    :placeholder="'0,00 ' + currency"
    @focus="onInputFocus"
    class="p-2 border-[1px] border-solid border-light-gray rounded-md focus-visible:outline-0 w-full"
  />
</template>

<script setup>
import { vueDebounce } from 'vue-debounce'
import { computed, ref } from 'vue'

const props = defineProps({
  toAmount: Number,
  calculateFromAmount: Function,
  currency: String
})
const toAmountRef = ref(0)

const vDebounce = vueDebounce({ lock: true })

const toAmountComp = computed(() => {
  toAmountRef.value = props.toAmount
  return parseFloat(String(toAmountRef.value)) + ` ${props.currency}`
})

const setRotation = (e) => {
  console.log(e.target)
  setTimeout(() => (toAmountRef.value = parseFloat(toAmountComp.split(' ')[0])), 1000)
}
const onInputFocus = (e) => {
  toAmountRef.value = props.toAmount
  toAmountRef.value = parseFloat(e.target.value.split(' ')[0])
}
</script>

<style lang="scss" scoped></style>
