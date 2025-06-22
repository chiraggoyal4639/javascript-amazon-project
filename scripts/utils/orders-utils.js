import { saveToStorage } from "../../data/cart.js";
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