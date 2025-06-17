import {cart, removeFromCart, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {getItemById, products} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, calculateDeliveryDate, deliveryOptionsHTML} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';


function saveNewQuantity(productId, quantityInput) {
  let newQuantity = Number(quantityInput.value);

  if (newQuantity < 0 || (newQuantity % 1) !== 0) {
    alert('Invalid Cart Quantity');
    return;
  } else if (newQuantity > 10) {
    alert('Limit of max quantity for order at one time is 10');
    return;
  }

  updateQuantity(productId, newQuantity);

  const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
  quantityLabel.innerHTML = newQuantity;

  const container = document.querySelector(`.js-cart-item-container-${productId}`);
  quantityInput.value = '';
  container.classList.remove('is-editing-quantity');

  renderCheckoutHeader();
  renderPaymentSummary();
}

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getItemById(productId, products);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getItemById(deliveryOptionId, deliveryOptions) || deliveryOptions[0];

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container 
        js-cart-item-container
        js-cart-item-container-${productId}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity js-product-quantity-${productId}">
              <span>
                Quantity: 
                <span class="quantity-label js-quantity-label-${matchingProduct.id}">
                  ${cartItem.quantity}
                </span>
              </span>

              <span class="js-update-link update-quantity-link link-primary"
                data-product-id="${productId}">
                Update
              </span>

              <input class="js-quantity-input quantity-input js-quantity-input-${productId}">

              <span class="js-save-link save-quantity-link link-primary"
                data-product-id="${productId}">
                Save 
              </span>

              <span class="js-delete-link delete-quantity-link link-primary
                js-delete-link-${productId}" 
                data-product-id="${productId}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(productId, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
      renderCheckoutHeader();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-link').forEach((saveLink) => {
    const productId = saveLink.dataset.productId;
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

    saveLink.addEventListener('click', () => {
      saveNewQuantity(productId, quantityInput);
    });

    quantityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        saveNewQuantity(productId, quantityInput);
      }
    });
  });
}
