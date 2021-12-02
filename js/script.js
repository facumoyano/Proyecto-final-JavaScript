//Creo mis variables para luego obtener información de ellas

let nombre = document.getElementById("form-nombre");
let email = document.getElementById("form-email");
let mayor = document.getElementById("form-check");
let btnForm = document.getElementById("btn-form");
let formulario = document.getElementById("form");
let formPadre = document.getElementById("formulario");
const contenedorProductos = document.querySelector(
  ".shoppingCartItemsContainer"
);
const openForm = document.querySelector("#openForm");
const form = document.querySelector(".form");
const closeForm = document.querySelector(".form-close");
const closeModal = document.querySelector("#cerrar-modal");
const modal = document.querySelector(".modal-contenedor");
const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//Creo mis cards de forma dinámica mediante AJAX llamando a un json local.

$(document).ready(() => {
  const url = "js/productos.json";

  $.get(url, function (respuesta, estado) {
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
        );
      }

      // Selecciono el boton de agregar producto y llamo a la función addProductClicked que lee la información de las cards

      const agregarProductoBoton =
        document.querySelectorAll(".agregarProducto");
      agregarProductoBoton.forEach((addBtn) => {
        addBtn.addEventListener("click", datosCard);
      });

      function datosCard(event) {
        const button = event.target;
        const item = button.closest(".card");

        const itemTitle = item.querySelector(".nombreProducto").textContent;
        const itemPrice = item.querySelector(".precioProducto").textContent;
        const itemImage = item.querySelector(".imgProduct").src;

        addProductToShop(itemTitle, itemPrice, itemImage);
      }

      //Función que añade los productos al carrito de compras

      function addProductToShop(itemTitle, itemPrice, itemImage) {
        const productTitle = contenedorProductos.getElementsByClassName(
          "shoppingCartItemTitle"
        );
        // Recorro las cards para que al agregar varias veces un producto no se duplique y aumente la cantidad del input
        for (let i = 0; i < productTitle.length; i++) {
          if (productTitle[i].innerText === itemTitle) {
            let cantidadElemento = productTitle[i].parentElement.parentElement.parentElement.querySelector(
              ".shoppingCartItemQuantity"
            );
            cantidadElemento.value++;

            //Actualizo el total del carrito
            actualizarTotalCarrito();
            return;
          }
        }

        // Creo los elementos del carrito dinámicamente

        const addElements = document.createElement("div");
        const contenidoProducto = `
        <div class="row shoppingCartItem">
        
            <div class="shopping-cart-item">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle">${itemTitle}</h6>
            </div>
        
        
            <div class="shopping-cart-price">
                <p class="item-price  shoppingCartItemPrice">${itemPrice}</p>
            </div>
        
        
            <div
                class="shopping-cart-quantity">
                <input class="shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="buttonDelete" type="button">X</button>
            </div>
            
        
        
        </div>`;
        addElements.innerHTML = contenidoProducto;
        contenedorProductos.append(addElements);

        //Selecciono el botón para eliminar productos del carrito y luego llamo a la función removerProducto
        addElements
          .querySelector(".buttonDelete")
          .addEventListener("click", removerProducto);

        //Selecciono el input de la cantidad del producto y luego llamo a la función cantidad elegida
        addElements
          .querySelector(".shoppingCartItemQuantity")
          .addEventListener("change", cantidadElegida);

        //Actualizo el total del carrito
        actualizarTotalCarrito();
      }

      //Función que me devuelve el total de los productos elegidos en el carrito
      function actualizarTotalCarrito() {
        let total = 0;
        const precioTotal = document.querySelector(".shoppingCartTotal");

        const shoppingCartItems =
          document.querySelectorAll(".shoppingCartItem");

        shoppingCartItems.forEach((shoppingCartItem) => {
          const itemProductPrice = shoppingCartItem.querySelector(
            ".shoppingCartItemPrice"
          );
          const shoppingCartItemPrice = parseInt(itemProductPrice.textContent);
          const shoppingCartItemQuantityElement =
            shoppingCartItem.querySelector(".shoppingCartItemQuantity");
          const itemCantidadProducto = parseInt(
            shoppingCartItemQuantityElement.value
          );
          total = total + shoppingCartItemPrice * itemCantidadProducto;
        });
        precioTotal.innerHTML = `$${total}`;
        return total;
      }

      //Función para eliminar productos del carrito
      function removerProducto(e) {
        const buttonClicked = e.target;
        buttonClicked.closest(".shoppingCartItem").remove();
        actualizarTotalCarrito();
      }
      //Función para que el usuario no pueda elegir un número negativo
      function cantidadElegida(e) {
        const input = e.target;
        if (input.value <= 0) {
          input.value = 1;
        }
        //Actualizo el total del carrito
        actualizarTotalCarrito();
      }

      //Utlizo jquery para abrir el carrito de compras

      $("#openShop").click(function (e) {
        e.preventDefault();
        $("#sidebar").css("right", 0);
      });

      //Utlizo jquery para cerrar el carrito de compras
      $("#cerrarCarrito").click(function (e) {
        e.preventDefault();
        $("#sidebar").css("right", "-100%");
      });

      //función para cerrar el formulario
      closeForm.addEventListener("click", (e) => {
        e.preventDefault();
        form.classList.remove("form-show");
      });

      //Utilizo jquery para abrir un modal cuando el usuario agregue un producto al carrito
      $(".agregarProducto").click((e) => {
        e.preventDefault();
        $(".modal").css({ opacity: 1, "pointer-events": "unset" });
      });

      // Utilizo jquery para cerrar el modal cuando el usuario da click en aceptar
      $("#modal-close").click((e) => {
        e.preventDefault();
        $(".modal").css({ opacity: 0, "pointer-events": "none" });
      });

      

      //Función para cerrar el modal mencionado arriba
      $("#alert-close").click((e) => {
        e.preventDefault();
        $(".alert").css({ opacity: 0, "pointer-events": "none" });
      })


      // Llamo a la función que llama a todas las funciones del formulario
      eventListenersForm();

      //Función que llama a todas las funciones del formulario.
      function eventListenersForm() {
        
        nombre.addEventListener("blur", validarFormulario);
        email.addEventListener("blur", validarFormulario);
        mayor.addEventListener("change", validarFormulario);
        btnForm.addEventListener("click", validarFormulario);
  }

  // Función para validar el formulario

      function validarFormulario(e) {
        // Si los campos tienen al menos un valor se agrega un borde verde al input, si no, se muestra un mensaje y se agrega un borde rojo al input
        if(e.target.value.length > 0) {
          const error = document.querySelector('p.error');
          if(error){
            error.remove();
          }

          e.target.classList.remove("border-red");
          e.target.classList.add("border-green");
        }else {
          e.target.classList.remove("border-green");
          e.target.classList.add("border-red");

          mostrarError("Todos los campos son obligatorios");
          
          
        }
        
        //Valido el mail
        if(e.target.type === "email"){

          if(er.test(e.target.value)){
            const error = document.querySelector('p.error');
            if(error){
              error.remove();
            }
      
            e.target.classList.remove("border-red");
            e.target.classList.add("border-green");
            
          }else {
            e.target.classList.remove("border-green");
            e.target.classList.add("border-red");

            mostrarError("Email no válido");
            
            
          }
        }
        //Si el email es válido y el nombre distinto a vacío y el usuario es mayor de edad, entonces se habilita el botón de enviar, si no, se desabilita
        if(er.test(email.value) && nombre.value !== '' && mayor.checked) {
          const error = document.querySelector('p.error');
          if(error){
            error.remove();
          }
          btnForm.style.opacity = "1";
          btnForm.disabled = false;
          btnForm.style.cursor = "pointer";
          
          btnForm.addEventListener('click', () => {
            enviarEmail(); 
            return;
          })

        }else {
          btnForm.style.opacity = "0.5";
          btnForm.disabled = true;
          btnForm.style.cursor = "no-drop";
        }
      }

      // Función para mostrar mensaje
      function mostrarError(mensaje) {
        const mensajeError = document.createElement("p");
        mensajeError.textContent = mensaje;
        mensajeError.classList.add("border-red", "mensaje-error", "error");

        const errores = document.querySelectorAll(".error");
        if(errores.length === 0){
          formulario.appendChild(mensajeError);
          
        }
        

      }

      // Función para enviar email si todos los campos han sido validados y el usuario da click en enviar
      function enviarEmail() {
        
        total = actualizarTotalCarrito();
        
        // Se muestra una animación
        const spinner = document.querySelector("#spinner");
        spinner.style.display = "flex"

        //Despues de tres segundos, la animación se esconde y se muestra un mensaje de compra finalizada
        setTimeout(() => {
          spinner.style.display = "none";

          const parrafo = document.createElement('p');
          const exito = document.querySelector(".exito")
          if(!exito) {
            parrafo.textContent = `Gracias por tu compra ${nombre.value}, el total de tu compra es: $${total}`;
            parrafo.classList.add("border-green", "mensaje-error", "exito")

          formulario.insertBefore(parrafo, spinner);
          }
          
          

      //Después de 5 segundos se resetan los campos del formulario, el mensaje de compra finalizada y se resetea el carrito de compras
      setTimeout(() => {
        parrafo.remove();
        resetearForm();
        const precioTotal = document.querySelector(".shoppingCartTotal");
          contenedorProductos.innerHTML = "";
          precioTotal.innerHTML = "$0";
      }, 5000)
    }, 3000)
  }

  // Función que resetea el formulario y deja el botón de enviar desabilitado
      function resetearForm() {
        formPadre.reset();
        btnForm.style.opacity = "0.5";
        btnForm.style.cursor = "no-drop";
        btnForm.disabled = true;
      }

      // Si al hacer click en comprar el total es igual a 0, aparece un modal de alerta, sino aparece el form para finalizar la compra
      $("#openForm").click((e) => {
        total = actualizarTotalCarrito();
        e.preventDefault();
        if(total == 0) {
          $(".alert").css({ opacity: 1, "pointer-events": "unset" });
        }else {
          $("#formulario").addClass("form-show");
        }
      })

      //GUARDO EL CLIENTE INGRESADO EN EL FORMULARIO EN EL LOCALSTORAGE

      function guardarUsuario(usuario) {
        btnForm.addEventListener("click", (e) => {
          e.preventDefault();
          let usuario = new Usuario(nombre.value, email.value, mayor.checked);
          let item = localStorage.getItem("listaUsuarios");
          if (item) {
            let almacenados = JSON.parse(localStorage.getItem("listaUsuarios"));
            almacenados.push(usuario);

            let almacenados_string = JSON.stringify(almacenados);
            localStorage.setItem("listaUsuarios", almacenados_string);
          } else {
            let almacenados = new Array();
            almacenados.push(usuario);
            let almacenados_string = JSON.stringify(almacenados);
            localStorage.setItem("listaUsuarios", almacenados_string);
          }
        });
      }
      guardarUsuario();
    }
  });
});
