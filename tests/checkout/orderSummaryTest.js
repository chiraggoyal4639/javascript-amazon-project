import { renderOrderSummary } from '../../scripts/checkout/orderSummary.js';
import { loadFromStorage, cart } from '../../data/cart.js';
import { loadProducts } from '../../data/products.js';

describe('test suite: renderOrderSummary', () => {
  const productId1 = '5968897c-4d27-4872-89f6-5bcb052746d7';
  const productId2 = '58b4fc92-e98c-42aa-8c55-b6b79996769a';

  beforeAll((done) => {
    loadProducts(() => {
      done();
    });
  })

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: '1'
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '1'
        }
      ]);
    });
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-checkout-header"></div>
      <div class="js-payment-summary"></div>
    `;
      
    loadFromStorage();
    renderOrderSummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the cart', () => {

    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(2);

    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain('Quantity: 2');

    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText
    ).toContain('Quantity: 1');
    
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText
    ).toEqual("Women's Chiffon Beachwear Cover Up - Black");

    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual('Waterproof Knit Athletic Sneakers - Gray');

    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText
    ).toEqual('$20.70');

    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual('$33.90');

  });

  it('removes a product', () => {

    document.querySelector(`.js-delete-link-${productId1}`).click();

    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(1);

    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);

    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);
    
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual('Waterproof Knit Athletic Sneakers - Gray');

    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual('$33.90');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });

  it('updates the delivery option', () => {
    document.querySelector(`.js-delivery-option-${productId1}-3`).click();
    expect(
      document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked
    ).toEqual(true);

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual('3');

    expect(
      document.querySelector('.js-payment-summary-shipping').innerText
    ).toEqual('$9.99');
    expect(
      document.querySelector('.js-payment-summary-total').innerText
    ).toEqual('$93.82');
  });

});
