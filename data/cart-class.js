class Cart {

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }
  #cartItems;
  #timeoutId;
  #localStorageKey;

  #loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
  }

  saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getCartQuantity(){
    let cartQuantity = 0;
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
  }

  addToCartArray(productId, quantity=1){
    let found = false;
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity += quantity;
        found = true;
      }
    });
    if (!found) {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }
    this.saveToStorage(this.localStorageKey, this.cartItems);
  }

  addToCart(productId){
    const selectElement = document.querySelector(`.js-${productId}-quantity`);
    const quantity = Number(selectElement.value);
    selectElement.value = 1;

    const addedElement= document.querySelector(`.js-${productId}-added`);
    addedElement.classList.add('add-to-cart-done');

    clearTimeout(this.timeoutId);
    this.timeoutId= setTimeout(() => {
      addedElement.classList.remove('add-to-cart-done')
    }, 2000);
    this.addToCartArray(productId, quantity);
    
    return quantity;
  }

  removeFromCart(productId){
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.productId !== productId);
    this.saveToStorage(this.localStorageKey, this.cartItems);
  }

  updateQuantity(productId, newQuantity){
    for(let i=0; i< this.cartItems.length; i++) {
      let product= this.cartItems[i];
      if (product.productId  === productId){
        product.quantity = newQuantity;
        this.saveToStorage(this.localStorageKey, this.cartItems);
        break
      }
    }
  }
};

const cart= new Cart('cart-oop');
const businessCart= new Cart('cart-business');

console.log(cart);
console.log(businessCart);