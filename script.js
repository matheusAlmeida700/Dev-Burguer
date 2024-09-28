const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
})

// FECHAR O MODAL QUANDO CLICAR FORA

// *event retorna todas as informações coletadas durante o evento de click incluindo o alvo que foi clicado
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal || event.target === closeModalBtn){
        cartModal.style.display = "none";
    }
})

// *verificando se clicou no elemento que tem essa classe ou em um elemento parente do mesmo
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");

    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        // transformando em float
        const price = parseFloat(parentButton.getAttribute("data-price"));

        // ADICIONAR NO CARRINHO
        addToCart(name, price);
    }
})

// FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price){
    // find percorre a lista inteira tipo for
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        // se o item já existe aumenta apenas a quantidade
        existingItem.quantity += 1;
    }else{
        // *adicionando um objeto dentro da lista com a propriedade quantity comecando com 1
        cart.push({
            name, price, quantity: 1,
        })
    }

    updateCartModal();
}

// ATUALIZA O CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        // criando uma div via JavaScript
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        // colocando o conteúdo dentro da div

        // obs: preco do item ajustado para 2 casas decimais
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `;

        total += item.price * item.quantity;

        // colocando um item dentro
        cartItemsContainer.appendChild(cartItemElement);
    })
    
    // formatando para a moeda brasileira
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;
}

// REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();

            // return para parar a execução do if
            return;
        }

        // o splice simplesmente remove o objeto da lista
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
    //
})

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        // USANDO A BIBLIOTECA DE ALERTAS
        Toastify({
            text: "Oops... O Restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        

        // return para barrar o código e não deixar enviar o pedido
        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");

        // return para ele parar e não ir para o código de baixo
        return;
    }

    // ENVIAR PEDIDO PARA API DO WHATSAPP

    // mapeando cada item com o map e retornando formatado
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )

        // .join para retornar em formato de string simples e não em array
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "15981769200";

    // CARREGANDO A URL DA API DO WHATSAPP
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    // ZERANDO O CARRINHO DEPOIS DA COMPRA
    cart = [];
    updateCartModal();
})

// VERIFICAR A HORA E MANIPULAR O CARD HORÁRIO
function checkRestaurantOpen(){

    // new Date gera a data atual
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    // true = restaurante está aberto
}
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-600");
}