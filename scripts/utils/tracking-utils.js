export function getProgress (order, product) {
  const orderTime = new Date(order.orderTime).getTime();
  const deliveryTime = new Date(product.estimatedDeliveryTime).getTime();
  const currentTime = new Date().getTime();

  let progress = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;
  progress = Math.max(0, Math.min(100, progress));
  return progress;
}