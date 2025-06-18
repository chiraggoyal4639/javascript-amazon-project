export function formatCurrency(priceCents){
  return (Math.round(priceCents) / 100).toFixed(2);
}

export function getItemById(itemId, items){
  return items.find(item => item.id == itemId);
}
