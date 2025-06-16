import {cart, removeFromCart, getCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {getItemById, products} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

function calculateDeliveryDate(deliveryOption){
  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays,
    'days'
  );
  return deliveryDate.format('dddd, MMMM D');
}
function deliveryOptionsHTML(productId, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = calculateDeliveryDate(deliveryOption);
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

    const isChecked = deliveryOption.id == cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${productId}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'Checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>
    `
  });
  return html;
}
function saveNewQuantity(productId, quantityInput){

  let newQuantity= Number(quantityInput.value);
  
  if (newQuantity < 0 || (newQuantity % 1) != 0){
    alert('Invalid Cart Quantity');
    return;
  } else if(newQuantity > 10){
    alert('Limit of max quantity for order at one time is 10');
    return;
  }
  updateQuantity(productId, newQuantity);

  const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
  quantityLabel.innerHTML = newQuantity;
  
  renderCheckoutHeader();
  renderPaymentSummary();
  
  const container = document.querySelector(`.js-cart-item-container-${productId}`);
  quantityInput.value='';
  container.classList.remove('is-editing-quantity');

}
export function renderOrderSummary(){
  let cartSummaryHTML= '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = getItemById(productId, products);
    
    const deliveryOptionId =cartItem.deliveryOptionId;
    let deliveryOption = getItemById(deliveryOptionId, deliveryOptions) || deliveryOptions[0];

    const dateString = calculateDeliveryDate(deliveryOption);
    
    cartSummaryHTML += `
      <div class="cart-item-container 
        js-cart-item-container-${productId}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>

              <span class="js-update-link update-quantity-link link-primary"
              data-product-id= "${productId}">
                Update
              </span>
              <input class= "js-quantity-input quantity-input js-quantity-input-${productId}">
              <span class= "js-save-link save-quantity-link link-primary"
              data-product-id= "${productId}">
                Save 
              </span>

              <span class="js-delete-link delete-quantity-link link-primary" data-product-id= "${productId}">
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
  document.querySelector('.js-order-summary').innerHTML= cartSummaryHTML;

  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click', ()=>{
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
  document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click', () => {
      const productId= link.dataset.productId;
      removeFromCart(productId);

      renderOrderSummary();
      renderCheckoutHeader();
      renderPaymentSummary();
    })
  })

  document.querySelectorAll('.js-update-link').forEach((updateLink)=>{
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add('is-editing-quantity');
    })
  })
  document.querySelectorAll('.js-save-link').forEach((saveLink)=>{
    const productId = saveLink.dataset.productId;
    const quantityInput= document.querySelector(`.js-quantity-input-${productId}`);

    saveLink.addEventListener('click', () => {
      saveNewQuantity(productId, quantityInput);
    })
    quantityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        saveNewQuantity(productId, quantityInput);
      }
    })
  })
}
