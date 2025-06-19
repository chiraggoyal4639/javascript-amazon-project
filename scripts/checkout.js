import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
// import '../data/cart-class.js';

async function loadPage() {
  try {
    // throw 'error1';
    await loadProductsFetch();

  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
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