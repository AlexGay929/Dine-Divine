
// Cart Open/Close
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Open Cart Function
cartIcon.onclick = () => {
    cart.classList.add('active');
}

// Close Cart
closeCart.onclick = () => {
    cart.classList.remove('active');
}

// Making add to cart
// Cart Working JS
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
}else {
    ready();
}

// Making Function 
function ready () {
    // remove item from cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem)
    }
    // Quantity Changed
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged)
    }
    // Add to cart
    var addCart = document.getElementsByClassName('card-button');
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }
    loadCartItems();
}

// Remove Cart Item
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
    updateCartIcon (); 
}

// Quantity Changed
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon ();
}

// Get all necessary elements from the parent element using getElement
function addCartClicked(event) {
    var button = event.target;
    var restaurantDishes = button.closest('.card');
    var title = restaurantDishes.getElementsByClassName('card-title')[0].innerText;
    var price = restaurantDishes.getElementsByClassName('price')[0].innerText;
    var cardImg = restaurantDishes.getElementsByClassName('card-image')[0].src;

    addDishToCart(title,price,cardImg);
    updatetotal();
    saveCartItems();
    updateCartIcon ();
}

// Add dish to cart function
function addDishToCart(title,price,cardImg) {
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for ( var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert('You have already added this dish to cart');
            return;
        }
    }
    var cartBoxContent = `
    <img src="${cardImg}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" name="" id="" value="1" class="cart-quantity">
    </div>
    <i class="bx bx-trash-alt cart-remove"></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
    cartShopBox
        .getElementsByClassName("cart-quantity")[0]
        .addEventListener('change', quantityChanged);
     saveCartItems();
     updateCartIcon ();
}

// update total price
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
  
    var formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    });
  
    for (var i = 0; i < cartBoxes.length; i++) {
      var cartBox = cartBoxes[i];
      var priceElement = cartBox.getElementsByClassName('cart-price')[0];
      var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
      var price = parseFloat(priceElement.innerText.replace('PHP', ''));
      var quantity = quantityElement.value;

      total += price * quantity;
    }
    // if price contain some cents 
      total = Math.round(total * 100) / 100;
  
    // Format the total price as Philippine Peso
    var formattedTotal = formatter.format(total);
  
    document.getElementsByClassName('total-price')[0].innerText = formattedTotal;
    // Save Total to local storage
    localStorage.setItem('cartTotal', formattedTotal);
  }

// Keep Item in cart when page refresh with localstorage
function saveCartItems() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];

    for (var i = 0; i < cartBoxes.length; i++) {
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var cardImg = cartBox.getElementsByClassName('cart-img')[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            cardImg: cardImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
} 

// Loads In Cart 
function loadCartItems () {
    var cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addDishToCart(item.title, item.price, item.cardImg);

            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText = "" + cartTotal;
    }
    updateCartIcon ();
}

// Quantity in Cart Icon
function updateCartIcon () {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity+= parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity', quantity);
}

// Clear Cart Item after successful payment
function clearCart() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    cartContent.innerHTML = "";
    updatetotal();
    localStorage.removeItem('cartItems');
}

/* ==========scroll reveal========= */
ScrollReveal({ 
    // reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal(' .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .card-container, .dish-container, .package-container', { origin: 'bottom' });
ScrollReveal().reveal('.hero-img, .about-img, .description',  { origin: 'left' });
ScrollReveal().reveal('.tables, .about-content', { origin: 'right' });

// Get all table elements
const tables = document.querySelectorAll('.table');

// Function to handle table selection
function selectTable() {
  // Remove selected class from all tables
  tables.forEach(table => {
    table.classList.remove('selected');
  });

  // Add selected class to the clicked table
  this.classList.add('selected');

  // Get the selected table number
  const tableNumber = this.getAttribute('data-table');

  // Display the selected table number
  const selectedTableText = document.getElementById('selected-table');
  selectedTableText.textContent = `Selected Table: ${tableNumber}`;
}

// Add event listener to each table
tables.forEach(table => {
  table.addEventListener('click', selectTable);
});

// Handle date selection
const datePicker = document.getElementById('date-picker');
datePicker.addEventListener('change', function() {
  const selectedDate = this.value;
  const selectedDateText = document.getElementById('selected-date');
  selectedDateText.textContent = `Selected Date: ${selectedDate}`;
});


// Reservation MODAL
window.onload = function() {
  const openModalBtn = document.getElementById("openModalBtn");
  const modal = document.getElementById("reservationModal");
  const closeModalBtn = document.getElementsByClassName("close")[0];
  const reservationForm = document.getElementById("reservationForm");

  // Open the modal
  openModalBtn.addEventListener("click", function() {
    modal.style.display = "block";
  });

  // Close the modal when close button is clicked
  closeModalBtn.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Close the modal when user clicks outside the modal
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
  reservationForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("selected-date").value;
    const time = document.getElementById("time").value;
    const phone = document.getElementById("phone").value;
    const guests = document.getElementById("guests").value;
    const selectedTable = document.getElementById("selected-table").value;

    // Create an object to store the form data
    const formData = {
      name: name,
      email: email,
      phone: phone,
      selecteddate: date,
      time: time,
      guests: guests,
      selectedTable : selectedTable
    };

    // Get existing form data from local storage (if any)
    let existingData = localStorage.getItem("reservationFormData");
    existingData = existingData ? JSON.parse(existingData) : [];

    // Add current form data to the existing data
    existingData.push(formData);

    // Save the updated form data to local storage
    localStorage.setItem("reservationFormData", JSON.stringify(existingData));

    // Reset the form
    reservationForm.reset();

    // Close the modal after submission
    modal.style.display = "none";

    // Display a success message or perform any other desired actions
    alert("Reservation submitted successfully!");
  });
};


  // Note modal Js
// Get the modal element
var noteModal = document.getElementById("noteModal");

// Get the button that opens the modal
var openNoteModalBtn = document.getElementById("openNoteModalBtn");

// Get the <span> element that closes the modal
var closeBtn = document.getElementsByClassName("closeNote")[0];

// Get the textarea element
var noteText = document.getElementById("noteText");

// When the user clicks the button, open the modal
openNoteModalBtn.onclick = function() {
  noteModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  noteModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == noteModal) {
    noteModal.style.display = "none";
  }
};

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('bx-x');
    navbar.classList.remove('active');
}



  

















