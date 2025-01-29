google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
window.addEventListener("load", populateTicker);
const price_chart_btn = document.getElementById("price_chart_btn");
const price_table_section = document.getElementById("price_table_section");
const all_inventory_btn = document.getElementById("all_inventory_btn");
const all_inventory_section = document.getElementById("all_inventory_section")
const insertButton = document.getElementById("insert_btn_section");
const formBlock = document.getElementById("formBlock");
const edit_btn = document.getElementsByClassName("edit-btn")
const jewelUpdateSection = document.getElementById("jewelUpdateSection");
let toggleDetailsFlag = true;
const base_url = 'http://127.0.0.1/'

// ====================== price chart section ==========================
price_chart_btn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click from propagating to the document
    price_table_section.style.display = (price_table_section.style.display === "none" || price_table_section.style.display === "") ? "block" : "none";
    all_inventory_section.style.display = "none"
});

document.addEventListener("click", function (e) {
    if (!price_table_section.contains(e.target) && e.target !== price_chart_btn) {
        price_table_section.style.display = "none";
        insertButton.style.display = 'block';
    }
});

// ======================= All inventory section =========================

all_inventory_btn.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click from propagating to the document
    all_inventory_section.style.display = (all_inventory_section.style.display === "none" || all_inventory_section.style.display === "") ? "block" : "none";
    price_table_section.style.display = "none"
});

document.addEventListener("click", function (e) {
    if (!all_inventory_section.contains(e.target) && e.target !== all_inventory_btn) {
        all_inventory_section.style.display = "none";
    }
});


// ========================= All inventory section ========================
// Jewelry data fetched from your backend
async function get_all_inventory(u_id) {
    const response = await fetch(`/get_all_data_by_id/${u_id}`);
    const result = await response.json();

    if (response.ok) {
        const all_data = result.data;
        if (all_data.length > 0) {
            const jewelryData = all_data;
            const cardsContainer = document.getElementById("cards-container");
            cardsContainer.innerHTML = ''; // Clear existing cards

            jewelryData.forEach(jewel => {
                const cardWrapper = document.createElement("div");
                cardWrapper.classList.add("j-card");

                // Calculate price details
                const j_material_price = get_price(jewel.j_material, jewel.j_purity);
                const j_material_cost = j_material_price * jewel.j_weight;
                const gst = (j_material_cost * jewel.j_gst) / 100;
                const westage = (j_material_cost * jewel.j_westage) / 100;
                const making_charge = (j_material_cost * jewel.j_making_charge) / 100;
                const j_price = (j_material_cost + gst + westage + making_charge);

                // Set the card HTML
                cardWrapper.innerHTML = `
                    <div class="j-card-inner">
                        <!-- Front -->
                        <div class="j-card-front">
                            <div class="edit-btn" onclick="editJewel(${jewel.j_id})">&#9998;</div>
                            <div class="delete-btn" onclick="deleteJewel(${jewel.j_id})">&#128465;</div>
                            <div class="j-card-tag">${jewel.j_tag}</div>
                            <div class="j-card-title">${jewel.j_name}</div>
                            <div class="j-card-info-section ${jewel.j_material.toLowerCase()}">
                                <div class="j-card-weight">${jewel.j_weight} Grams</div>
                                <div class="j-card-purity">${jewel.j_purity} | ${jewel.j_material}</div>
                            </div>
                            <div class="row" style="margin-top: 20px;">
                                <div class="col-sm-6">
                                    <div style="text-align: center;">Westage</div>
                                    <div style="text-align: center;">${jewel.j_westage} %</div>
                                </div>
                                <div class="col-sm-6">
                                    <div style="text-align: center;">Making</div>
                                    <div style="text-align: center;">${jewel.j_making_charge} %</div>
                                </div>
                            </div>
                            <button id="total_amt_btn" style="background-color: transparent; border: none;" onclick="redirectToBilling(${jewel.j_id})">
                                <div class="j-card-price" style="margin-top: 30px;" id="totalAmt">Rs. ${j_price}</div>
                            </button>
                        </div>
                        <!-- Back -->
                        <div class="j-card-back">
                            <img src="${jewel.j_image || 'default_img.jpg'}" alt="${jewel.j_name}">
                        </div>
                    </div>
                `;

                // Add flip functionality
                const cardInner = cardWrapper.querySelector(".j-card-inner");
                cardWrapper.addEventListener("click", () => {
                    cardInner.classList.toggle("flipped");
                });

                // Append the card to the container
                cardsContainer.appendChild(cardWrapper);
            });
        } else {
            alert(`Inventory is empty`);
        }
    }
}

// Edit functionality
async function editJewel(j_id) {
    console.log('edit btn pressed j_id : ', j_id);
    const insert_btn_section = document.getElementById("insert_btn_section");
    const form_block = document.getElementById('formBlock');
    const jewel_update = document.getElementById('jewelUpdateSection');
   
    const response = await fetch(`/get_jewel_id/${j_id}`, { method: 'GET' })
    const result = await response.json();
    if (response.ok) {
        let j_data = result.data;
        if (j_data.length > 0) {
            console.log(j_data[0])
            let raw_data = j_data[0]
            document.getElementById('uj_tag').value = raw_data.j_tag;
            document.getElementById('uj_name').value = raw_data.j_name;
            document.getElementById('uj_material').value = raw_data.j_material;
            document.getElementById('uj_purity').value = raw_data.j_purity;
            document.getElementById('uj_weight').value = raw_data.j_weight;
            document.getElementById('uj_westage').value = raw_data.j_westage;
            document.getElementById('uj_making_charge').value = raw_data.j_making_charge;
            document.getElementById('uj_gst').value = raw_data.j_gst;
        }
        else {
            alert(`Not able to find the Jewel with ${j_id}`);
        }
    }
    jewel_update.style.display = 'block'
    insert_btn_section.style.display = 'none';
    form_block.style.display = 'none';
}


async function update_to_db(j_id, u_id) {
    let data = {
        'u_id': u_id,
        'j_tag': document.getElementById('uj_tag').value,
        'j_name': document.getElementById('uj_name').value,
        'j_material': document.getElementById('uj_material').value,
        'j_purity': document.getElementById('uj_purity').value,
        'j_weight': document.getElementById('uj_weight').value,
        'j_westage': document.getElementById('uj_westage').value,
        'j_making_charge': document.getElementById('uj_making_charge').value,
        'j_gst': document.getElementById('uj_gst').value,
    };
    console.log({ 'update_to_db': data, 'j_id': Number(j_id) })
    try {
        const response = await fetch(`/update_jewel_id/${j_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            console.log(result);
            alert(result.data);
            location.reload();
            
        } else {
            console.error('Error:', result);
            alert('Failed to insert jewelry. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while connecting to the server.');
    }
}

// Delete functionality
function deleteJewel(j_id) {
    alert(`Delete Jewel with ID: ${j_id}`);
}



function get_price(j_material, j_purity) {
    console.log(`${j_material}_price_${j_purity}`);
    let material_price = document.getElementById(`${j_material}_price_${j_purity}`).value
    return Number(material_price)
}


// =========================== insert section ==============================
// Show/hide the form when the button is clicked
insertButton.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click from propagating to the document
    formBlock.style.display = (formBlock.style.display === "none" || formBlock.style.display === "") ? "block" : "none";
    insertButton.style.display = "none";
});

// Hide the form when clicking outside of it
document.addEventListener("click", function (e) {
    if (!formBlock.contains(e.target) && e.target !== insertButton) {
        formBlock.style.display = "none";
        insertButton.style.display = "block";
    }
});

function populateTicker() {
    const tableRows = document.querySelectorAll("#price_table_section table tbody tr");
    const tickerContent = document.getElementById("ticker-content");

    let tickerHTML = "";

    tableRows.forEach(row => {
        const material = row.cells[1].textContent.trim();
        const purity = row.cells[3].textContent.trim();
        const price = row.cells[5].querySelector("input").value;

        tickerHTML += `<span style="margin-right: 70px;">${material} (${purity}): Rs. ${price}</span>`;
    });

    // Duplicate the content to ensure seamless looping
    tickerContent.innerHTML = tickerHTML + tickerHTML;
}

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
        'u_id': u_id,
        'j_tag': j_tag
    }
    console.log(data)
    try {
        const response = await fetch('/get_jewel_tag', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            let jewel_data = result.data;
            if (jewel_data.length > 0) {
                console.log(jewel_data[0]);
                appendJewelDetails(jewel_data[0])
                console.log('jewel details displayed sucessfully')
            }
            else {
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

function appendJewelDetails(jewel) {
    // Calculate price details
    const j_material_price = get_price(jewel.j_material, jewel.j_purity);
    const j_material_cost = j_material_price * jewel.j_weight;
    const gst = (j_material_cost * jewel.j_gst) / 100;
    const westage = (j_material_cost * jewel.j_westage) / 100;
    const making_charge = (j_material_cost * jewel.j_making_charge) / 100;
    const j_price = (j_material_cost + gst + westage + making_charge);
    const cardHTML = `
        <div class="j-card" onclick="this.classList.toggle('flipped')">
            <div class="j-card-inner">
                <!-- Front -->
                <div class="j-card-front">
                    <div class="edit-btn" onclick="editJewel(${jewel.j_id})">&#9998;</div>
                    <div class="delete-btn" onclick="deleteJewel(${jewel.j_id})">&#128465;</div>
                    <p id="jewel_id" style="font-size: 60px; display: none;">${jewel.j_id}</p>
                    <p id="jewelMaterial" style="font-size: 60px; display: none;">${jewel.j_material}</p>
                    <p id="jewelMaterialprice" style="font-size: 60px; display: none;">${jewel.j_making_charge}</p>
                    <p id="jewelGST" style="font-size: 60px; display: none;">${jewel.j_gst}</p>
                    <div class="j-card-tag" id="jewelTag">${jewel.j_tag}</div>
                    <div class="j-card-title" id="jewelName">${jewel.j_name}</div>
                    <div class="j-card-info-section ${jewel.j_material}">
                        <div class="j-card-weight" id="jewelWeight">${jewel.j_weight} Grams</div>
                        <div class="j-card-purity" id="jewelPurity">${jewel.j_purity} | ${jewel.j_material}</div>
                    </div>
                    <div class="row" style="margin-top: 20px;">
                        <div class="col-sm-6">
                            <div style="text-align: center;">Westage</div>
                            <div style="text-align: center;" id="jewelWestage">${jewel.j_westage}%</div>
                        </div>
                        <div class="col-sm-6">
                            <div style="text-align: center;">Making</div>
                            <div style="text-align: center;" id="jewelMakingCharge">${jewel.j_making_charge}%</div>
                        </div>
                    </div>
                    <button id="total_amt_btn" style="background-color: transparent; border: none;" onclick="redirectToBilling(${jewel.j_id})">
                        <div class="j-card-price" style="margin-top: 30px;" id="totalAmt">Rs. ${j_price}</div>
                    </button>
                </div>
                <!-- Back -->
                <div class="j-card-back">
                    <img src="${jewel.j_image || 'default_img.jpg'}" alt="Image of ${jewel.j_name}" style="width: 100%; height: 100%;">
                </div>
            </div>
        </div>
    `;
    // Append the card HTML to the jewelDetailsSection
    const jewelDetailsSection = document.getElementById("jewelDetailsSection");
    jewelDetailsSection.innerHTML = ''
    jewelDetailsSection.style.display = "block"; // Ensure the section is visible
    jewelDetailsSection.innerHTML += cardHTML; // Append the new card
}


async function displayJewelDetails(data) {
    console.log('calling display jewel details');
    console.log({ 'data from db': data })
    let calculate_amt = await total_amt(data);
    document.getElementById('jewel_id').innerHTML = data.j_id;
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
    document.getElementById('jewelDetailsSection').style.display = 'block';
}

function drawChart(bill_data) {
    console.log({ 'bill_data': bill_data })
    if (bill_data == undefined) {
        console.log("undefined error")
        return 0
    }
    else {
        var bill_keys = ['material_price', 'westage', 'making_charge', 'gst']
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'bill_keys');
        data.addColumn('number', 'bill_values');

        for (let i = 0; i < bill_keys.length; i++) {
            data.addRow([
                bill_keys[i],
                Number(bill_data[bill_keys[i]])
            ])
            console.log([bill_keys[i], bill_data[bill_keys[i]]])
        }

        var options = {
            title: 'Bill Pie Chart',
            titleTextStyle: {
                color: 'white',
                fontSize: 15
            },
            legend: {
                position: 'right',
                textStyle: {
                    color: 'blue'
                }
            },
            backgroundColor: 'transparent',
            chartArea: {
                left: 50,
                right: 10,
                top: 50,
                bottom: 50,
                width: '100%',
                height: '100%'
            },
            tooltip: {
                isHtml: true,
                trigger: 'focus'
            },

            focusTarget: 'category',

            pointSize: 7,
            interpolateNulls: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('bill_chart'));

        chart.draw(data, options);
    }
}

function toggle_btn() {
    console.log('toggle btn pressed')
    const optionalDetailsRows = document.querySelectorAll('#optionalDetails');
    optionalDetailsRows.forEach(row => {
        if (row.classList.contains('visible')) {
            row.classList.remove('visible');
        } else {
            row.classList.add('visible');
        }
    });
}

function back_to_details(u_id) {
    console.log('back to details button pressed');
    document.getElementById('jewelDetailsSection').style.display = 'block';
    document.getElementById('jewelUpdateSection').style.display = 'none';
    get_jewel(u_id);
}

async function update_btn(j_id) {
    console.log('update_btn pressed');
    document.getElementById('jewelDetailsSection').style.display = 'none';
    document.getElementById('jewelUpdateSection').style.display = 'block';

    const response = await fetch(`/get_jewel_id/${j_id}`, { method: 'GET' })
    const result = await response.json();
    if (response.ok) {
        let j_data = result.data;
        if (j_data.length > 0) {
            console.log(j_data[0])
            let raw_data = j_data[0]
            document.getElementById('uj_tag').value = raw_data.j_tag;
            document.getElementById('uj_name').value = raw_data.j_name;
            document.getElementById('uj_material').value = raw_data.j_material;
            document.getElementById('uj_purity').value = raw_data.j_purity;
            document.getElementById('uj_weight').value = raw_data.j_weight;
            document.getElementById('uj_westage').value = raw_data.j_westage;
            document.getElementById('uj_making_charge').value = raw_data.j_making_charge;
            document.getElementById('uj_gst').value = raw_data.j_gst;
        }
        else {
            alert(`Not able to find the Jewel with ${j_id}`);
        }
    }
}

async function delete_jewel(j_id) {
    try {
        console.log('Deleting jewel with ID:', j_id);
        const confirmDelete = confirm(`Are you sure you want to delete the jewel with ID ${j_id}?`);
        if (!confirmDelete) {
            return;
        }

        const response = await fetch(`/delete_jewel_id/${j_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            alert(result.data);
            location.reload();
        } else {
            alert(`Failed to delete jewel: ${result.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error deleting jewel:', error);
        alert('An error occurred while trying to delete the jewel.');
    }
}

async function total_amt(data) {
    let material_price = (get_price(data.j_material, data.j_purity)) * data.j_weight;
    let westage = material_price * (data.j_westage / 100);
    let making_charge = (material_price + westage) * (data.j_making_charge / 100);
    let gst = (material_price + westage + making_charge) * (data.j_gst / 100);
    let total = material_price + westage + making_charge + gst;
    let total_amt_data = {
        'material_price': material_price.toFixed(2),
        'westage': westage.toFixed(2),
        'making_charge': making_charge.toFixed(2),
        'gst': gst.toFixed(2),
        'total': total.toFixed(2),
    }
    console.log(total_amt_data);
    return total_amt_data
}


function print_bill() {
    console.log('Print bill button pressed');

    // Retrieve content from both sections
    const jewelDetailContent = document.getElementById('jewelDetailsSection').outerHTML;
    const billingChartContent = document.getElementById('billing_chart_section').outerHTML;

    // Open a new window for printing
    const newWindow = window.open('', '_blank');

    // Write content to the new window
    newWindow.document.write(`
        <html>
        <head>
            <title>Print Jewel Details</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color:black
                }
                .section {
                    margin-bottom: 20px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="section">
                <h2>Jewel Details</h2>
                ${jewelDetailContent}
            </div>
            <div class="section">
                <h2>Billing Chart</h2>
                ${billingChartContent}
            </div>
        </body>
        </html>
    `);

    // Close and print the new window
    newWindow.document.close();
    newWindow.print();
}

// ===================================== Billing Chart section ===============================
async function redirectToBilling(j_id) {
    // Get the total amount from the button
    let totalAmt = document.getElementById("totalAmt").innerText.replace("Rs. ", "").trim();
    
    // Encode the amount to pass it via URL
    var url = `/billing/${j_id}?total_amt=${encodeURIComponent(totalAmt)}`;
    
    console.log("Redirecting to:", url);
    window.location.href = url;
}

// ===========================================================================================
function index_test() {
    console.log('js file attached successfully')
}

async function logout() {
    let url = `/logout`
    let response = await fetch(url)
    if (response.ok) {
        window.location.href = "/login"
    }
    else {
        window.location.href = "/page_not_found"
    }
}