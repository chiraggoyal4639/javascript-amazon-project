export let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

export function addToCart(productId, timeoutId){
  const selectElement = document.querySelector(`.js-${productId}-quantity`);
  const quantity = Number(selectElement.value);
  selectElement.value = 1;

  const addedElement= document.querySelector(`.js-${productId}-added`);
  addedElement.classList.add('add-to-cart-done');

  clearTimeout(timeoutId);
  timeoutId= setTimeout(() => {
    addedElement.classList.remove('add-to-cart-done')
  }, 2000);

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
      quantity
    });
  }
  saveToStorage('cart', cart);

  return { quantity, timeoutId };
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