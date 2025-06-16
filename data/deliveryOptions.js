import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {formatCurrency} from '../scripts/utils/money.js'

export const deliveryOptions = [{
  id : '1',
  deliveryDays : 7,
  priceCents : 0
}, {
  id : '2',
  deliveryDays : 3,
  priceCents : 499
}, {
  id : '3',
  deliveryDays : 1,
  priceCents : 999
}]

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let deliveryDate = today;
  let daysRemaining = deliveryOption.deliveryDays;

  while (daysRemaining > 0) {
    deliveryDate = deliveryDate.add(1, 'day');
    if (deliveryDate.day() !== 0 && deliveryDate.day() !== 6) {
      daysRemaining--;
    }
  }
  return deliveryDate.format('dddd, MMMM D');
}
export function deliveryOptionsHTML(productId, cartItem) {
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
