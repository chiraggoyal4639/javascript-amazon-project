import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
// import '../data/cart-class.js';

async function loadPage() {
  await loadProductsFetch();
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();

/*
loadProductsFetch().then(() => {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
})
*/
/*
loadProducts (() => {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
})
*/