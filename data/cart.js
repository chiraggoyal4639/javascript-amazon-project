export const cart= [];

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

  cart.forEach((cartItem) => {
    if(cartItem.productId===productId){
      cartItem.quantity+=quantity;
    } else {
      cart.push({
        productId,
        quantity
      });
    }
  })
  return { quantity, timeoutId };
}