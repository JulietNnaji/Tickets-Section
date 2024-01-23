const dev = 'http://localhost:5000'
const render = 'https://chronicles-of-ushebebe.onrender.com'
const baseUrl = render

async function initTickets(
    emails,
    ticketName,
    pricePayed,
    ticketCount,
    ownerName,
    ownerPhone,
    ownerEmail,
) {
    var ref = `${generateRef()}_ub24_${generateRef()}`
    let submitFormButton = document.getElementById("submit-form-button");

    console.log('Initializing tickets');
    axios({
        method: "post",
        url: `${baseUrl}/api/v1/ticket/`,
        data: {
            emails,
            ticketName,
            pricePayed,
            ticketCount,
            ownerName,
            ownerPhone,
            ownerEmail,
            paystackRef: ref,
        },
    }).then(function (data) {
        const msg = data.data.msg
        console.log(msg);

        console.log('Going to paystack');
        payWithPaystack(
            ref,
            pricePayed,
            ownerEmail,
        );

    }).catch(function (err) {
        console.log('Got stuck herer')
        if (err.response.data.msg) {
            alert(err.response.data.msg);
        } else {
            alert(err);
        }
        submitFormButton.classList.remove("button--loading");
        submitFormButton.disabled = false;
    });
}

async function payWithPaystack(
    ref,
    totalPrice,
    ownerEmail,
) {

    let submitFormButton = document.getElementById("submit-form-button");

    console.log(ref)
    console.log(totalPrice)

    var handler = PaystackPop.setup({
        key: 'pk_test_3fd484332d77673781bde81a6b614928e662fe89',
        email: ownerEmail,
        amount: totalPrice * 100,
        currency: 'NGN',
        ref,
        callback: function (response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;
            updateTickets(reference);
        },
        onClose: function () {
            submitFormButton.classList.remove("button--loading");
            submitFormButton.disabled = false;
            alert('Transaction was not completed, window closed.');
        },
    });
    handler.openIframe();
}

async function updateTickets(
    paystackRef
) {

    let submitFormButton = document.getElementById("submit-form-button");

    axios({
        method: "patch",
        url: `${baseUrl}/api/v1/ticket/${paystackRef}`,
    }).then(function (data) {
        const msg = data.data.msg
        console.log(msg);
        submitFormButton.classList.remove("button--loading");
        submitFormButton.disabled = false;
        window.location.href = 'successful_page.html';

    }).catch(function (err) {
        if (err.response.data.msg) {
            alert(err.response.data.msg);
        } else {
            alert(err);
        }
        submitFormButton.classList.remove("button--loading");
        submitFormButton.disabled = false;
    });
}

function generateRef() {
    let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    let length = 10 // Customize the length here.
    for (let i = length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]
    return result
}
