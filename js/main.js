$(function () {
    var template = $('#transaction-template').hide();

    $('#add').click(function () {
        // TODO: Validation
        template.clone()
            .insertAfter(template)
            .show()
            .find('.transaction-description').text($('#add-description').val()).end()
            .find('.transaction-amount').text($('#add-amount').val()).end();
    });
});
