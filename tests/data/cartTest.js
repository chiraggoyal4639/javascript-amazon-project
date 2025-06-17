import {addToCartArray, cart, loadFromStorage} from '../../data/cart.js';

describe('test suite: addToCart', ()=>{
  it('adds an existing product to the cart', ()=>{

    spyOn(localStorage, 'setItem');
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
    expect(cart[0].productId).toEqual('5968897c-4d27-4872-89f6-5bcb052746d7');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds an new product to the cart', ()=>{

    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(()=>{
      return JSON.stringify([]);
    });
    loadFromStorage();
    
    addToCartArray('5968897c-4d27-4872-89f6-5bcb052746d7', 1);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('5968897c-4d27-4872-89f6-5bcb052746d7');
    expect(cart[0].quantity).toEqual(1);
  });
});