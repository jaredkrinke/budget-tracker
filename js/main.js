$(function () {
    // Events
    var balanceUpdated = function () { };
    var transactionAdded = function () { };

    // Data model
    // TODO: Load from local storage
    var balance = 0;
    var transactions = [];

    var addTransactionInternal = function (transaction) {
        transactions.unshift(transaction);
        balance -= transaction.amount;
    };

    var addTransaction = function (transaction) {
        addTransactionInternal(transaction);

        // TODO: Persist changes to local storage

        balanceUpdated(balance);
        transactionAdded(transaction);
    };

    // UI
    var template = $('#transaction-template').hide();
    var addDescription = $('#add-description');
    var addDescriptionGroup = $('#add-description-group');
    var addAmount = $('#add-amount');
    var addAmountGroup = $('#add-amount-group');
    $('#add').click(function () {
        // Validation
        var description = addDescription.val();
        var descriptionValid = (description.length > 0);
        var amount = +addAmount.val();
        var amountValid = (!isNaN(amount) && amount !== 0 && (Math.floor(amount * 100) === amount * 100));
        var valid = descriptionValid && amountValid;

        if (valid) {
            // Valid transaction; add it
            addTransaction({
                description: description,
                amount: amount,
            });
        } else {
            // Highlight validation errors
            if (descriptionValid) {
                addDescriptionGroup.removeClass('has-error');
            } else {
                addDescriptionGroup.addClass('has-error');
            }

            if (amountValid) {
                addAmountGroup.removeClass('has-error');
            } else {
                addAmountGroup.addClass('has-error');
            }
        }
    });

    // Bind UI to data model
    // TODO: Currency formatting and symbol
    var balanceText = $('#balance');
    var balanceStatus = $('#balance-status');
    balanceUpdated = function (balance) {
        balanceText.text(balance);

        var statusClass = 'panel-success';
        if (balance < 0) {
            statusClass = 'panel-danger';
        } else if (balance < 50) {
            statusClass = 'panel-warning';
        }
        balanceStatus.removeClass('panel-success panel-warning panel-danger').addClass(statusClass);
    };

    transactionAdded = function (transaction) {
        template.clone()
            .insertAfter(template)
            .show()
            .find('.transaction-description').text(transaction.description).end()
            .find('.transaction-amount').text(transaction.amount).end();
    };

    // Initial state
    balanceUpdated(balance);

    // TODO: Deleting transactions
    // TODO: Automate monthly addition of funds
});
