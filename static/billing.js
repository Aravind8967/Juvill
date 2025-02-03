async function calculateTotal(u_id) {
    // Get all values from the HTML
    const j_gst = parseInt(document.getElementById('bj_gst').innerText);
    const j_name = document.getElementById('bj_name');
    const j_material = document.getElementById('bj_material').innerText;
    const j_purity = document.getElementById('bj_purity').innerText;
    const j_weight = parseFloat(document.getElementById('bj_weight').innerText);
    const j_making_charge = parseFloat(document.getElementById('bj_making_charge').innerText);
    const j_westage = parseFloat(document.getElementById('bj_westage').innerText);

    data = {
        'j_material' : j_material,
        'j_purity' : j_purity,
        'j_westage' : j_westage,
        'j_weight' : j_weight,
        'j_gst' :j_gst,
        'j_making_charge' : j_making_charge
    };
    var amount_data = await total_amt(u_id, data);
    let gst_selection = document.getElementById('gst-selector').value;
    let final_total = gst_selection === "yes" ? amount_data['total'] : amount_data['without_gst']
    console.log(data);
    document.getElementById('total-amount').innerText = `Rs. ${final_total}`;
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
