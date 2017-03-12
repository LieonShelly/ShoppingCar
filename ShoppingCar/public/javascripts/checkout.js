console.log("执行了checkout.js");
Stripe.setPublishableKey('pk_test_h7ZrNphsJD6i9aUzKk5yp14a');

var $form = $('#checkout-form');

$form.submit(function(event) {
    $('#change-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) {
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        console.log("执行了stripeToken");
        $form.get(0).submit();
    }
}