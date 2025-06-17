function Cart(localStorageKey){
  const cart = {
    cartItems: undefined,

    loadFromStorage(){
      cart.cartItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    },

    saveToStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    getCartQuantity(){
      let cartQuantity = 0;
      cart.cartItems.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
      return cartQuantity;
    },

    timeoutId: undefined,

    addToCartArray(productId, quantity){
      let found = false;
      cart.cartItems.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.quantity += quantity;
          found = true;
        }
      });
      if (!found) {
        cart.cartItems.push({
          productId,
          quantity,
          deliveryOptionId: '1'
        });
      }
      cart.saveToStorage(localStorageKey, cart.cartItems);
    },

    addToCart(productId){
      const selectElement = document.querySelector(`.js-${productId}-quantity`);
      const quantity = Number(selectElement.value);
      selectElement.value = 1;

      const addedElement= document.querySelector(`.js-${productId}-added`);
      addedElement.classList.add('add-to-cart-done');

      clearTimeout(cart.timeoutId);
      cart.timeoutId= setTimeout(() => {
        addedElement.classList.remove('add-to-cart-done')
      }, 2000);
      cart.addToCartArray(productId, quantity);
      
      return quantity;
    },

    removeFromCart(productId){
      cart.cartItems = cart.cartItems.filter((cartItem) => cartItem.productId !== productId);
      cart.saveToStorage(localStorageKey, cart.cartItems);
    },

    updateQuantity(productId, newQuantity){
      for(let i=0; i< cart.cartItems.length; i++) {
        let product= cart.cartItems[i];
        if (product.productId  === productId){
          product.quantity = newQuantity;
          cart.saveToStorage(localStorageKey, cart.cartItems);
          break
        }
      }
    }
  };
  return cart;
}

const cart= Cart('cart-oop');
const businessCart= Cart('cart-business');

cart.loadFromStorage();
businessCart.loadFromStorage();
