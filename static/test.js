const insertButton = document.getElementById("insertJewelButton");
const formBlock = document.getElementById("formBlock");
let toggleDetailsFlag = true;
const base_url = 'http://127.0.0.1/'

// Show/hide the form when the button is clicked
insertButton.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click from propagating to the document
    formBlock.style.display = (formBlock.style.display === "none" || formBlock.style.display === "") ? "block" : "none";
});

// Hide the form when clicking outside of it
document.addEventListener("click", function (e) {
    if (!formBlock.contains(e.target) && e.target !== insertButton) {
        formBlock.style.display = "none";
    }
});

async function insert_new_jewel(u_id) {
    // Collect data from the form
    let data = {
        'u_id': u_id,
        'j_tag': document.getElementById('j_tag').value,
        'j_name': document.getElementById('j_name').value,
        'j_material': document.getElementById('j_material').value,
        'j_purity': document.getElementById('j_purity').value,
        'j_weight': document.getElementById('j_weight').value,
        'j_westage': document.getElementById('j_westage').value,
        'j_making_charge': document.getElementById('j_making_charge').value,
        'j_gst': document.getElementById('j_gst').value,
    };

    console.log(data); // Log for debugging

    try {
        // Send data to the backend
        const response = await fetch('/insert_jewel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Parse the JSON response
        const result = await response.json();

        if (response.ok) {
            console.log(result); // Log the server response
            alert(result.data); // Display success message
        } else {
            console.error('Error:', result);
            alert('Failed to insert jewelry. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while connecting to the server.');
    }
}

async function get_jewel(u_id) {
    let j_tag = document.getElementById('jewel_tag').value
    let data = {
        'u_id' : u_id,
        'j_tag' : j_tag
    }
    console.log(data)
    try {
        const response = await fetch('/get_jewel_tag' , {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            let jewel_data = result.data;
            if (jewel_data.length > 0){
                console.log(jewel_data[0]);
                displayJewelDetails(jewel_data[0]);
                console.log('jewel details displayed sucessfully')
            }
            else{
                alert(`Not able to find the Jewel with ${j_tag}`);
            }
        } else {
            console.error('Error:', result);
            alert(`Not able to find the Jewel with ${j_tag} Tag number`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while connecting to the server.');
    }
}

async function displayJewelDetails(data) {
    console.log('calling display jewel details');
    console.log({'data from db' : data})
    let calculate_amt = total_amt(data);

    document.getElementById('jewelTag').innerText = data.j_tag;
    document.getElementById('jewelName').innerText = data.j_name;
    document.getElementById('jewelMaterial').innerText = data.j_material;
    document.getElementById('jewelPurity').innerText = data.j_purity;
    document.getElementById('jewelWeight').innerText = data.j_weight;
    document.getElementById('jewelMaterialprice').innerText = calculate_amt.material_price;
    document.getElementById('jewelWestage').innerText = calculate_amt.westage;
    document.getElementById('jewelMakingCharge').innerText = calculate_amt.making_charge;
    document.getElementById('jewelGST').innerText = calculate_amt.gst;
    document.getElementById('totalAmt').innerText = calculate_amt.total;

    // Show the details section
    document.getElementById('jewelDetails').style.display = 'block';
    toggleDetailsButton.addEventListener('click', function () {
        console.log('toggle btn pressed')
        const optionalDetailsRows = document.querySelectorAll('#optionalDetails');
        optionalDetailsRows.forEach(row => {
            if (row.classList.contains('visible')) {
                row.classList.remove('visible');
            } else {
                row.classList.add('visible');
            }
        });
    });  
    if (printButton) {
        printButton.addEventListener('click', function () {
            const printContents = document.getElementById('jewelDetails').outerHTML;
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`<html><head><title>Print Jewel Details</title></head><body>${printContents}</body></html>`);
            newWindow.document.close();
            newWindow.print();
        });
    }
}

// function toggle_btn(){
//     console.log('toggle btn pressed')
//     const optionalDetailsRows = document.querySelectorAll('#optionalDetails');
//     optionalDetailsRows.forEach(row => {
//         if (row.classList.contains('visible')) {
//             row.classList.remove('visible');
//         } else {
//             row.classList.add('visible');
//         }
//     });
// }



function get_price (j_material, j_purity){
    let material_price = document.getElementById(`${j_material}_price_${j_purity}`).value
    return Number(material_price)
}

function total_amt(data) {
    let material_price = (get_price(data.j_material, data.j_purity)) * data.j_weight;
    let westage = material_price * (data.j_westage / 100);
    let making_charge = (material_price + westage) * (data.j_making_charge / 100);
    let gst = (material_price + westage + making_charge) * (data.j_gst / 100);
    let total = material_price + westage + making_charge + gst;
    let total_amt_data = {
        'material_price' : material_price.toFixed(2),
        'westage' : westage.toFixed(2),
        'making_charge' : making_charge.toFixed(2),
        'gst' : gst.toFixed(2),
        'total' : total.toFixed(2),
    }
    console.log(total_amt_data);
    return total_amt_data
}



// function hide_optionals(){
//     console.log('hide opetional button pressed')
//     document.getElementById('toggleDetailsButton').addEventListener('click', function () {
//         const optionalDetails = document.getElementById('optionalDetails');
//         if (optionalDetails.style.display === 'none') {
//             optionalDetails.style.display = 'block';
//         } else {
//             optionalDetails.style.display = 'none';
//         }
//     });
// }

// function print_bill(){
//     console.log('print bill button pressed')
//     document.getElementById('printButton').addEventListener('click', function () {
//         const printContents = document.getElementById('jewelDetails').outerHTML;
//         const newWindow = window.open('', '_blank');
//         newWindow.document.write(`<html><head><title>Print Jewel Details</title></head><body>${printContents}</body></html>`);
//         newWindow.document.close();
//         newWindow.print();
//     });
// }


function test(){
    console.log('js file attached successfully')
}

async function logout() {
    let url = `/logout`
    let responce = await fetch(url)
    if (responce.ok){
        window.location.href = "/login"
    }
    else{
        window.location.href = "/page_not_found"
    }
}