import { saveToStorage } from "../../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getItemById } from "./utils.js";
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
  orders.unshift(order);
  saveToStorage('orders', orders);
}

export function getOrderTime(orderTime){
  const date = new Date(orderTime);
  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${day} ${month}`;
}

export function cancelOrder(orderId) {
  const idx = orders.findIndex(order => order.id === orderId);
  if (idx !== -1) {
    orders.splice(idx, 1);
    saveToStorage('orders', orders);
  }
}

export function getDeliveryDateWithWeekends(orderTime, estimatedDeliveryTime) {
  let current = dayjs(orderTime);
  const backendEstimate = dayjs(estimatedDeliveryTime);
  const deliveryOffsetDays = backendEstimate.diff(current, 'day');
  let businessDaysToAdd = deliveryOffsetDays;

  while (businessDaysToAdd > 0) {
    current = current.add(1, 'day');
    const isWeekend = current.day() === 0 || current.day() === 6;
    if (!isWeekend) {
      businessDaysToAdd--;
    }
  }
  return current.format('dddd, MMMM D');
}