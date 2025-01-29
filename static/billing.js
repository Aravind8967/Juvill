let gstIncluded = false; // Tracks whether GST is included

function calculateTotal() {
    const weight = document.getElementById('bj_weight').innerText;
    const gstPercent = document.getElementById('bj_gst').innerText;
    const makingChargePercent = document.getElementById('bj_making_charge').innerText;
    const wastagePercent = document.getElementById('bj_westage').innerText;
    console.log({'weight' : [weight, typeof weight], 
                'gstPercent' : [gstPercent, typeof gstPercent], 
                'makingChargePercent' : [makingChargePercent, typeof makingChargePercent],
                'wastagePercent' : [wastagePercent, typeof wastagePercent]});
    // // Material cost
    // const materialCost = materialPricePerGram * weight;

    // // Wastage, Making Charges
    // const wastageCost = (materialCost * wastagePercent) / 100;
    // const makingCharge = (materialCost * makingChargePercent) / 100;

    // // Calculate Total
    // let totalAmount = materialCost + wastageCost + makingCharge;

    // if (gstIncluded) {
    //     const gst = (totalAmount * gstPercent) / 100;
    //     totalAmount += gst;
    // }

    // // Update the Total Amount
    // document.getElementById("total-amount").textContent = `Rs. ${totalAmount.toFixed(2)}`;
}

function toggleGST() {
    gstIncluded = !gstIncluded; // Toggle GST inclusion
    calculateTotal(); // Recalculate total
}

function printPage() {
    calculateTotal(); // Ensure latest total is shown
    setTimeout(() => {
        window.print();
    }, 300); // Allow DOM to update before printing
}

function billing_js(){
    console.log("billing js file attached")
}
