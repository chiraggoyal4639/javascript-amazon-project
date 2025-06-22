import { saveToStorage } from "../../data/cart.js";
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