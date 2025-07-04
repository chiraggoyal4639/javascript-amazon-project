import {cart, getCartQuantity, saveToStorage, updateCartQuantity} from '../../data/cart.js'
import { deliveryOptions } from '../../data/deliveryOptions.js';
import {products} from '../../data/products.js'
import { getItemById, formatCurrency } from '../utils/utils.js';
import { addOrder } from '../utils/orders-utils.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0

  cart.forEach((cartItem) => {
    const product = getItemById(cartItem.productId, products);
    productPriceCents += (product.priceCents)*(cartItem.quantity);

    const deliveryOption = getItemById(cartItem.deliveryOptionId, deliveryOptions);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;
  const cartQuantity = getCartQuantity();

  const paymentSummaryHTML= `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try{
        if(cart.length != 0){
          const response = await fetch('https://supersimplebackend.dev/orders', {
            method : 'POST',
            headers : {
              'Content-type': 'application/json'
            },
            body : JSON.stringify({
              cart : cart
            })
          });
          const order = await response.json();
          addOrder(order);
          cart.length = 0;
          saveToStorage('cart', cart);
        }
              
      } catch (error) {
        alert('Could not place order. Please try again later.');
      }
      window.location.href = 'orders.html';
    })
}