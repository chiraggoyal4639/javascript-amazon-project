export let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
  localStorage.setItem('cart', JSON.stringify(cart));

  return { quantity, timeoutId };
}