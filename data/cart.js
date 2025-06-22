export let cart;
loadFromStorage();

export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}
export function updateCartQuantity(){
  document.querySelector('.js-cart-quantity').innerHTML= getCartQuantity();
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

let timeoutId;

export function addToCartArray(productId, quantity){
  let found = false;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity += quantity;
      found = true;
    }
  });
  if (!found) {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }
  saveToStorage('cart', cart);
}

export function addToCart(productId){
  const selectElement = document.querySelector(`.js-${productId}-quantity`);
  const quantity = Number(selectElement.value);
  selectElement.value = 1;

  const addedElement= document.querySelector(`.js-${productId}-added`);
  addedElement.classList.add('add-to-cart-done');

  clearTimeout(timeoutId);
  timeoutId= setTimeout(() => {
    addedElement.classList.remove('add-to-cart-done')
  }, 2000);
  addToCartArray(productId, quantity);
}
export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem)=>{
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage('cart', cart);

}
export function updateQuantity(productId, newQuantity){
  for(let i=0; i< cart.length; i++) {
    let product= cart[i];
    if (product.productId  === productId){
      product.quantity = newQuantity;
      saveToStorage('cart', cart);
      break
    }
  }
}