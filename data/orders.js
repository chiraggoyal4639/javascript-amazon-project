import { formatCurrency, getItemById } from "../scripts/utils/utils.js";
import { saveToStorage, addToCartArray, updateCartQuantity } from "./cart.js";
import { products, loadProductsFetch } from "./products.js";

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

export function addOrderHTML(){
  let ordersGridElement = document.querySelector('.js-orders-grid');

  orders.forEach((order) => {
    ordersGridElement.innerHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${getOrderTime(order.orderTime)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid js-${order.id}-details-grid"></div>
      </div>
    `;
    let orderDetailsGridElement = document.querySelector(`.js-${order.id}-details-grid`);

    order.products.forEach((product) => {
      const productId = product.productId;
      const matchingProduct = getItemById(productId, products);

      orderDetailsGridElement.innerHTML += `
        <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${getOrderTime(product.estimatedDeliveryTime)}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button 
            class="buy-again-button button-primary js-buy-again-button"
            data-product-id="${productId}"
            data-product-qty="${product.quantity}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&&productId=${productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    })
  });
  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const qty = Number(button.dataset.productQty) || 1;
      addToCartArray(productId, qty);
      updateCartQuantity();
      button.textContent = 'Added!';
      setTimeout(() => button.textContent = 'Buy it again', 2000);
    });
  });
}

export async function loadPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
  addOrderHTML();
}