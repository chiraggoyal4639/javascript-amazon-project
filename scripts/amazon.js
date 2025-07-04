import {cart, addToCart, getCartQuantity, updateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import {formatCurrency} from './utils/utils.js'

loadProducts(renderProductsGrid);

function doSearch() {
  const input = document.querySelector('.js-input-button');
  const searchValue = input.value.trim();
  if (searchValue) {
    const encoded = encodeURIComponent(searchValue);
    window.location.href = `amazon.html?search=${encoded}`;
  } else {
    window.location.href = 'amazon.html';
  }
}
function renderProductsGrid() {
  const url = new URL(window.location.href);
  const searchTerm = url.searchParams.get('search')?.toLowerCase() || '';

  const searchInput = document.querySelector('.js-input-button');
  if (searchInput) {
    searchInput.value = url.searchParams.get('search') || '';
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        doSearch();
      }
    });
  }

  let productsHTML= ``;

  const filtered= products.filter((product) => {
    return product.name.toLowerCase().includes(searchTerm);
  })

  const gridEl = document.querySelector('.js-products-grid');

  if(filtered.length === 0){
    gridEl.classList.add('empty-grid');

    productsHTML += `
      <div class="no-results">
        <h2>No products found<span class="highlight"> for “laptop”</span></h2>
        <p>We couldn’t find any items matching your search. Try adjusting your keywords or browse our full catalog below.</p>
        <a href="amazon.html">View all products</a>
      </div>
    `;
    document.querySelector('.js-products-grid').innerHTML = productsHTML;
    return;
  }

  gridEl.classList.remove('empty-grid');
  filtered.forEach((product)=>{
    productsHTML+= `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-${product.id}-quantity">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-${product.id}-added">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id= "${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  })

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  let cartQuantity = getCartQuantity();
  let timeoutId;

  updateCartQuantity();

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click',()=>{
      const { productId }= button.dataset;
      addToCart(productId);
      updateCartQuantity();
    })
  });
}


document.querySelector('.js-search-button').addEventListener('click', doSearch);
