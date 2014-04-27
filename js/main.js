$(function () {
    // Constants
    var currencySymbol = '$';
    var transactionHistorySize = 10;

    // Events
    var balanceUpdated = function () { };
    var transactionAdded = function () { };

    // Data model
    var balance = +localStorage['balance'] || 0;
    var transactionsJSON = localStorage['transactions'];
    var transactions = (transactionsJSON ? JSON.parse(transactionsJSON) : []);

    var addTransactionInternal = function (transaction) {
        transactions.push(transaction);
        balance -= transaction.amount;
    };

    var addTransaction = function (transaction) {
        addTransactionInternal(transaction);

        // Persist changes to local storage
        localStorage['balance'] = balance;
        localStorage['transactions'] = JSON.stringify(transactions.slice(-transactionHistorySize));

        balanceUpdated(balance);
        transactionAdded(transaction);
    };

    // UI
    var template = $('#transaction-template').hide();
    var addDescription = $('#add-description');
    var addDescriptionGroup = $('#add-description-group');
    var addAmount = $('#add-amount');
    var addAmountGroup = $('#add-amount-group');
    var contributeAmount = $('#contribute-amount');
    var contributeAmountGroup = $('#contribute-amount-group');

    var validateAmount = function (amount) {
        return (!isNaN(amount) && amount > 0 && (Math.floor(amount * 100) === amount * 100));
    };

    $('#add').click(function () {
        // Validation
        var description = addDescription.val();
        var descriptionValid = (description.length > 0);
        // TODO: Ignore currency symbols in the input
        var amount = +addAmount.val();
        var amountValid = validateAmount(amount);
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
    
    $('#contribute').click(function () {
        var amount = +contributeAmount.val();
        var valid = validateAmount(amount);
        if (valid) {
            contributeAmountGroup.removeClass('has-error');
            addTransaction({
                description: 'Contribution',
                amount: -amount,
            })
        } else {
            contributeAmountGroup.addClass('has-error');
        }
    });

    var formatAmount = function (number) {
        return (number >= 0 ? '' : '-') + currencySymbol + Math.abs(number).toFixed(2);
    };

    // Bind UI to data model
    var balanceText = $('#balance');
    var balanceStatus = $('#balance-status');
    balanceUpdated = function (balance) {
        balanceText.text(formatAmount(balance));

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
            .find('.transaction-amount').text(formatAmount(transaction.amount)).end();
    };

    // Initial state
    balanceUpdated(balance);
    for (var i = 0, count = transactions.length; i < count; i++) {
        transactionAdded(transactions[i]);
    }

    // TODO: Deleting transactions
    // TODO: Automate monthly addition of funds
});
