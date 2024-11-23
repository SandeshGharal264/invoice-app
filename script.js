document.addEventListener('DOMContentLoaded', function () {
    const itemList = document.getElementById('item-list');
    const invoicePreview = document.getElementById('invoice-preview');
    const taxRateInput = document.getElementById('tax-rate');
    const discountInput = document.getElementById('discount');
    const clientNameInput = document.getElementById('client-name');
    const clientAddressInput = document.getElementById('client-address');

    // Add new item row
    document.getElementById('add-item').addEventListener('click', () => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('row', 'mb-3', 'align-items-center');

        itemRow.innerHTML = `
            <div class="col-md-4">
                <input type="text" class="form-control item-description" placeholder="Item description" required>
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control item-quantity" placeholder="Qty" min="1" required>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control item-price" placeholder="Price" step="0.01" min="0" required>
            </div>
            <div class="col-md-2">
                <span class="item-total">$0.00</span>
            </div>
            <div class="col-md-1">
                <button class="btn btn-danger btn-remove">X</button>
            </div>
        `;

        itemList.appendChild(itemRow);

        itemRow.querySelector('.btn-remove').addEventListener('click', () => {
            itemRow.remove();
            updateInvoicePreview();
        });

        itemRow.querySelectorAll('.item-quantity, .item-price').forEach(input => {
            input.addEventListener('input', updateInvoicePreview);
        });
    });

    function updateInvoicePreview() {
    let subtotal = 0;
    const rows = itemList.querySelectorAll('.row');

    // Add Client Details
    const clientName = clientNameInput.value.trim();
    const clientAddress = clientAddressInput.value.trim().replace(/\n/g, "<br>");

    let invoiceHTML = `
        <div class="invoice-header">
            <h1>Invoice</h1>
        </div>
        <div class="section">
            <h4>Client Details:</h4>
            <p><strong>Name:</strong> ${clientName || "N/A"}</p>
            <p><strong>Address:</strong><br>${clientAddress || "N/A"}</p>
        </div>
        <div class="section">
            <h4>Items:</h4>
            <ul>
    `;

    rows.forEach(row => {
        const description = row.querySelector('.item-description').value;
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const rowTotal = quantity * price;

        row.querySelector('.item-total').textContent = `$${rowTotal.toFixed(2)}`;
        subtotal += rowTotal;

        if (description) {
            invoiceHTML += `<li>${description}: ${quantity} x $${price.toFixed(2)} = $${rowTotal.toFixed(2)}</li>`;
        }
    });

    invoiceHTML += `</ul></div>`;

    // Add Tax, Discount, and Totals
    const taxRate = parseFloat(taxRateInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;

    const taxAmount = (taxRate / 100) * subtotal;
    const grandTotal = subtotal + taxAmount - discount;

    invoiceHTML += `
        <div class="section totals">
            <h4>Subtotal: $${subtotal.toFixed(2)}</h4>
            <h4>Tax (${taxRate}%): $${taxAmount.toFixed(2)}</h4>
            <h4>Discount: -$${discount.toFixed(2)}</h4>
            <h4>Grand Total: $${grandTotal.toFixed(2)}</h4>
        </div>
    `;

    invoicePreview.innerHTML = invoiceHTML;
}

    taxRateInput.addEventListener('input', updateInvoicePreview);
    discountInput.addEventListener('input', updateInvoicePreview);
    clientNameInput.addEventListener('input', updateInvoicePreview);
    clientAddressInput.addEventListener('input', updateInvoicePreview);

    document.getElementById('print-btn').addEventListener('click', () => {
        const originalContent = document.body.innerHTML;
        const invoiceContent = document.getElementById('invoice-preview').outerHTML;

        document.body.innerHTML = invoiceContent;
        window.print();
        document.body.innerHTML = originalContent;
    });
});
