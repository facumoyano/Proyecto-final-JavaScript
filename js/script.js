

$(document).ready(() => {
  const url = "js/productos.json";
  
  $.get(url, function(respuesta, estado) {
    if (estado === "success") {
      let misDatos = respuesta;

      for (const dato of misDatos) {
        $("#card").append(
          `<div class="card" id="card">
            <div class="card-image">
              <img src=${dato.imagen} alt="" class="imgProduct"/>
            </div>
      
            <div class="card-nombreProducto">
              <h2 class="nombreProducto">${dato.nombre}</h2>
            </div>
            <div class="card-contenedor-precio">
              <div class="card-precio">
                <span
                  >Precio <br />
                  Por botella</span
                >
              </div>
              <div class="card-precio"><p class="precioProducto">${dato.precio}</p></div>
            </div>
            <div class="card-agregarProducto">
            <button class="agregarProducto" id="boton${dato.id}">Agregar producto</button>
            </div>
      </div>`
        )
      }
    


const agregarProductoBoton = document.querySelectorAll('.agregarProducto');
agregarProductoBoton.forEach((addBtn) => {
  addBtn.addEventListener('click', addProductClicked);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', mostrarMsj);

const contenedorProductos = document.querySelector(
  '.shoppingCartItemsContainer'
);

function addProductClicked(event) {
  const button = event.target;
  const item = button.closest('.card');

  const itemTitle = item.querySelector('.nombreProducto').textContent;
  const itemPrice = item.querySelector('.precioProducto').textContent;
  const itemImage = item.querySelector('.imgProduct').src;

  addProductToShop(itemTitle, itemPrice, itemImage);
}

function addProductToShop(itemTitle, itemPrice, itemImage) {
  const productTitle = contenedorProductos.getElementsByClassName(
    'shoppingCartItemTitle'
  );
  for (let i = 0; i < productTitle.length; i++) {
    if (productTitle[i].innerText === itemTitle) {
      let cantidadElemento = productTitle[i].parentElement.parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
      cantidadElemento.value++;
      
      actualizarTotalCarrito();
      return;
    }
  }

  const addElements = document.createElement('div');
  const contenidoProducto = `
  <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class=" buttonDelete" type="button">X</button>
            </div>
            
        </div>
        
    </div>`;
  addElements.innerHTML = contenidoProducto;
  contenedorProductos.append(addElements);

  addElements.querySelector('.buttonDelete').addEventListener('click', removerProducto);

  addElements.querySelector('.shoppingCartItemQuantity').addEventListener('change', cantidadElegida);

  actualizarTotalCarrito();
}

function actualizarTotalCarrito() {
  let total = 0;
  const precioTotal = document.querySelector('.shoppingCartTotal');

  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

  shoppingCartItems.forEach((shoppingCartItem) => {
    const itemProductPrice = shoppingCartItem.querySelector('.shoppingCartItemPrice');
    const shoppingCartItemPrice = parseInt(itemProductPrice.textContent);
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector('.shoppingCartItemQuantity');
    const itemCantidadProducto = parseInt(shoppingCartItemQuantityElement.value);
    total = total + shoppingCartItemPrice * itemCantidadProducto;});
  precioTotal.innerHTML = `$${total}`;
  return total;
  
}

function removerProducto(event) {
  const buttonClicked = event.target;
  buttonClicked.closest('.shoppingCartItem').remove();
  actualizarTotalCarrito();
}

function cantidadElegida(event) {
  const input = event.target;
  if (input.value <= 0){
    input.value = 1;
  }
  actualizarTotalCarrito();
}



$('#openShop').click(function(e) {
  e.preventDefault();
  $('#sidebar').css('right', 0);

})

$('#cerrarCarrito').click(function(e) {
  e.preventDefault();
  $('#sidebar').css('right', "-100%")
})

const openForm = document.querySelector("#openForm");
const form = document.querySelector(".form");
const closeForm = document.querySelector(".form-close");
const closeModal = document.querySelector("#cerrar-modal");
const modal = document.querySelector(".modal-contenedor");


  
    

openForm.addEventListener('click', (e) => {
  e.preventDefault();
  form.classList.add('form-show');
})

closeForm.addEventListener('click', (e) => {
  e.preventDefault();
  form.classList.remove('form-show');
})


let nombre = document.getElementById("form-nombre");
let email = document.getElementById("form-email");
let mayor = document.getElementById("form-check");
let btnForm = document.getElementById("btn-form");
let formulario = document.getElementById("form");

function mostrarMsj() {  
  total = actualizarTotalCarrito();
  
  btnForm.addEventListener('click', function(e) {
  e.preventDefault();
  if(nombre.value === "") {
    alert("Ingresa tu nombre");
    nombre.focus();
    return false;
  }
  if(email.value === "") {
    alert("Ingresa un email");
    email.focus();
    return false;
  }
  if(mayor.checked) {
    const addMsj = document.createElement("div");
    addMsj.classList.add("form-msj");
    addMsj.innerHTML = `<div>Gracias por tu compra ${nombre.value}, el total de tu compra es: $${total}</div>`
    formulario.appendChild(addMsj);
  }else {
    const addMsj = document.createElement("div");
    addMsj.classList.add("form-msj-negativo");
    addMsj.innerHTML = `<div>No eres mayor de edad</div>`
    formulario.appendChild(addMsj);
  }

  const precioTotal = document.querySelector('.shoppingCartTotal');
    contenedorProductos.innerHTML = '';
    precioTotal.innerHTML = '$0';

    

})}


}
})
})