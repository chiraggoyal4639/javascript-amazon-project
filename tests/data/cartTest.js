import {addToCartArray, cart, loadFromStorage, removeFromCart} from '../../data/cart.js';
import { updateDeliveryOption } from '../../data/deliveryOptions.js';

describe('test suite: addToCart', ()=>{
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  })
  it('adds an existing product to the cart', ()=>{

    spyOn(localStorage, 'getItem').and.callFake(()=>{
      return JSON.stringify([{
        productId: '5968897c-4d27-4872-89f6-5bcb052746d7',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();

    addToCartArray('5968897c-4d27-4872-89f6-5bcb052746d7', 1);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: '5968897c-4d27-4872-89f6-5bcb052746d7',
      quantity: 2,
      deliveryOptionId: '1'
    }]));
    expect(cart[0].productId).toEqual('5968897c-4d27-4872-89f6-5bcb052746d7');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds an new product to the cart', ()=>{

    spyOn(localStorage, 'getItem').and.callFake(()=>{
      return JSON.stringify([]);
    });
    loadFromStorage();
    
    addToCartArray('5968897c-4d27-4872-89f6-5bcb052746d7', 1);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: '5968897c-4d27-4872-89f6-5bcb052746d7',
      quantity: 1,
      deliveryOptionId: '1'
    }]));
    expect(cart[0].productId).toEqual('5968897c-4d27-4872-89f6-5bcb052746d7');
    expect(cart[0].quantity).toEqual(1);
  });
});

describe('test suite: removeFromCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();
  });

  it('removes a product from the cart', () => {
    removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  })

  it('does nothing if product is not in the cart', () => {
    removeFromCart('does-not-exist');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  });
})

describe('test suite: updateDeliveryOption', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();
  });

  it('updates the delivery option', () => {
    updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', '3');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '3'
    }]));
  });

  it('does nothing if the product is not in the cart', () => {
    updateDeliveryOption('does-not-exist', '3');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('does nothing if the delivery option does not exist', () => {
    updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 'does-not-exist');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

})
