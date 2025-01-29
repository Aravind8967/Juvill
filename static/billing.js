function calculateTotal() {
    // Get all values from the HTML
    const weight = parseFloat(document.getElementById('bj_weight').innerText);
    const gstPercent = parseFloat(document.getElementById('bj_gst').innerText);
    const makingChargePercent = parseFloat(document.getElementById('bj_making_charge').innerText);
    const wastagePercent = parseFloat(document.getElementById('bj_westage').innerText);
    let baseTotal = parseFloat(document.getElementById('total-amount').getAttribute("data-original-amount"));

    // Get GST selection
    let gstSelection = document.getElementById('gst-selector').value;
    let gstCharge = gstSelection === "yes" ? (baseTotal * gstPercent) / 100 : 0; // Apply GST if selected

    // Calculate additional charges
    let makingCharge = (baseTotal * makingChargePercent) / 100;
    let wastageCharge = (baseTotal * wastagePercent) / 100;

    let finalTotal = baseTotal + makingCharge + wastageCharge + gstCharge;

    // Update total amount on page
    document.getElementById('total-amount').innerText = `Rs. ${finalTotal.toFixed(2)}`;
}

function printPage() {
    calculateTotal(); // Ensure latest total is displayed
    setTimeout(() => {
        window.print();
    }, 300); // Delay to update UI before printing
}

function billing_js(){
    console.log("billing js file attached");
}
