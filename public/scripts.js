window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader-hidden");
    loader.addEventListener("transitionend", () => {
        document.body.removeChild("loader");
    })

    // Initialize the form title and total price on page load
    document.getElementById("formTitle").innerText = localStorage.getItem('ticketType') + ' Ticket Registration Form';
    document.getElementById("totalPrice").innerText = 'N' + localStorage.getItem('ticketPrice');

    // Dynamically set the form title based on the ticket type
    function setTicketInfo(type, price) {
        localStorage.setItem('ticketType', type);
        localStorage.setItem('ticketPrice', price);
        document.getElementById("formTitle").innerText = type + ' Ticket Registration Form';
        document.getElementById("totalPrice").innerText = 'N' + price;
        window.location.href = "registration.html";
    }

    document.getElementById("tickets").addEventListener("change", function () {
        var ticketDetails = document.getElementById("ticketDetails");
        var ticketFields = document.getElementById("ticketFields");
        ticketFields.innerHTML = "";

        if (this.value > 1) {
            ticketDetails.style.display = "block";
            for (var i = 1; i <= this.value; i++) {
                var nameLabel = document.createElement("label");
                nameLabel.textContent = "Ticket Holder " + i + " Name:";
                ticketFields.appendChild(nameLabel);

                var nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.id = "ticketName" + i;
                nameInput.name = "ticketName" + i;
                nameInput.placeholder = "Enter ticket holder " + i + "'s name";
                ticketFields.appendChild(nameInput);

                var emailLabel = document.createElement("label");
                emailLabel.textContent = "Ticket Holder " + i + " Email:";
                ticketFields.appendChild(emailLabel);

                var emailInput = document.createElement("input");
                emailInput.type = "email";
                emailInput.id = "ticketEmail" + i;
                emailInput.name = "ticketEmail" + i;
                emailInput.placeholder = "Enter ticket holder " + i + "'s email";
                ticketFields.appendChild(emailInput);
            }
        } else {
            ticketDetails.style.display = "none";
        }

        // Update the total price
        updateTotalPrice();
    });

    function updateTotalPrice() {
        var numberOfTickets = document.getElementById("tickets").value;
        var ticketPrice = localStorage.getItem('ticketPrice');

        // Calculate the total price
        var totalPrice = numberOfTickets * ticketPrice;

        // Display the total price
        document.getElementById("totalPrice").innerText = 'N' + totalPrice.toFixed(2);
    }
})

function submitForm() {

    let submitFormButton = document.getElementById("submit-form-button");
    var ticketType = localStorage.getItem('ticketType');

    // Logic for form submission
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var numberOfTickets = document.getElementById("tickets").value;
    var numberOfTicketsInt = parseInt(numberOfTickets);
    var ticketPrice = localStorage.getItem('ticketPrice');

    const emailRegexp =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    var names = [];
    var emails = [];

    // Additional logic for ticket holder details
    if (numberOfTickets > 1) {
        for (var i = 1; i <= numberOfTickets; i++) {
            var ticketHolderName = document.getElementById("ticketName" + i).value;
            var ticketHolderEmail = document.getElementById("ticketEmail" + i).value;

            names.push(ticketHolderName);
            emails.push(ticketHolderEmail);
        }
    }
    var totalPrice = numberOfTickets * ticketPrice;

    if (name == "" || email == "" || phone == "") {
        alert("Ensure you input all value in all fields!");
    } else if (!emailRegexp.test(email)) {
        alert('Invalid email');
    } else if (numberOfTickets > 1) {

        console.log(typeof (emails.length), emails.length);
        console.log(typeof (numberOfTicketsInt), numberOfTicketsInt);

        if (emails.length === numberOfTicketsInt) {
            submitFormButton.disabled = true;
            submitFormButton.classList.add("button--loading");
            payWithPaystack(
                emails,
                ticketName = ticketType,
                totalPrice,
                ticketCount = numberOfTickets,
                ownerName = name,
                ownerPhone = phone,
                ownerEmail = email,
            );
        } else {
            alert('Please fill in ticket holders details');
        }
    } else {
        submitFormButton.disabled = true;
        submitFormButton.classList.add("button--loading");
        payWithPaystack(
            emails,
            ticketName = ticketType,
            totalPrice,
            ticketCount = numberOfTickets,
            ownerName = name,
            ownerPhone = phone,
            ownerEmail = email,
        );
    }

}