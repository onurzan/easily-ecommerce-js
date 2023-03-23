const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const modal = document.getElementById('modal-wrapper');
const modalInfo = document.getElementById('modal-info');
const modalList = document.querySelector('.modal-list');

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProducts();
});

function fetchCategories() {
  fetch('https://api.escuelajs.co/api/v1/categories')
    .then((response) => response.json())
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const categoryDıv = document.createElement('div');
        categoryDıv.classList.add('category');
        categoryDıv.innerHTML = `
           <img src="${category.image}"/>
           <span>${category.name}</span>
        `;
        categoryList.appendChild(categoryDıv);
      })
    )
    .catch((err) => console.log(err));
}

function fetchProducts() {
  fetch('https://api.escuelajs.co/api/v1/products/')
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((product) => {
        const productDıv = document.createElement('div');
        productDıv.classList.add('product');
        productDıv.innerHTML = `
            <img src="${product.images[0]}" />
            <p class="product-title">${product.title}</p>
            <p class="product-category">${product.category.name}</p>
            <div class="product-action">
              <p>${product.price} $</p>
              <button onclick="sepeteEkle({id:'${product.id}',name:'${product.title}',price:'${product.price}',image:'${product.images[0]}',amount:1})">ADD</button>
            </div>
          `;
        productList.appendChild(productDıv);
      })
    )
    .catch();
}

let basket = [];
var toplam = 0;

const addList = () => {
  basket.forEach((product) => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.innerHTML = `
                  <div>
                      <img src="${product.image}">
                  </div>              
                  <h2>${product.name}</h2>
                  <h2>${product.price}</h2>
                  <p>Amount: ${product.amount}</p>
                  <button id="del" onclick="deleteFrom({id:'${product.id}',price:'${product.price}',amount:'${product.amount}'})">Del</button>
  `;
    modalList.appendChild(listItem);

    toplam += Number(product.price) * Number(product.amount);
  });
};

const deleteFrom = (param) => {
  basket = basket.filter((i) => i.id != param.id);
  toplam -= Number(param.price) * param.amount;
  modalInfo.innerText = toplam;
};
modalList.addEventListener('click', (e) => {
  if (e.target.id === 'del') {
    e.target.parentElement.remove();
  }
});

openBtn.addEventListener('click', () => {
  toggleModal();
  addList();
  modalInfo.innerText = toplam;
});

closeBtn.addEventListener('click', () => {
  toggleModal();
  modalList.innerHTML = ' ';
  toplam = 0;
});

function toggleModal() {
  modal.classList.toggle('active');
}

function sepeteEkle(product) {
  const findItem = basket.find((eleman) => eleman.id === product.id);

  if (findItem) {
    findItem.amount += 1;
  } else {
    basket.push(product);
  }
}