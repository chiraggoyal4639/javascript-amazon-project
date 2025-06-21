import { orders, getOrderTime } from "../data/orders.js";
import { getItemById } from "./utils/utils.js";
import { products, loadProductsFetch } from "../data/products.js";

function addTrackingHTML() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getItemById(orderId, orders);
  const product = order.products.find(product => product.productId == productId);
  console.log(product);
  const matchingProduct = getItemById(productId, products);

  const productName = matchingProduct.name;
  console.log(productName);
  const productQuantity = product.quantity;
  const deliveryDate = getOrderTime(product.estimatedDeliveryTime);
  const productImage = matchingProduct.image;

  const trackingElement = document.querySelector('.js-order-tracking');
  trackingElement.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${deliveryDate}
    </div>

    <div class="product-info">
      ${productName}
    </div>

    <div class="product-info">
      Quantity: ${productQuantity}
    </div>

    <img class="product-image" src="${productImage}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;
}
export async function loadPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
  addTrackingHTML();
}
