import { saveToStorage } from "./cart.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
  orders.unshift(order);
  saveToStorage('orders', orders);
}
