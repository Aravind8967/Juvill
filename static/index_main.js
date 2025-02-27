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

            for (const jewel of jewelryData) {
                const cardWrapper = document.createElement("div");
                cardWrapper.classList.add("j-card");
                
                var total_amt_data = await total_amt(u_id, jewel)

                // Set the card HTML
                cardWrapper.innerHTML = `
                    <div class="j-card-inner">
                        <!-- Front -->
                        <div class="j-card-front">
                            <div class="edit-btn" onclick="editJewel(${jewel.j_id})">&#9998;</div>
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
                                <div class="j-card-price" style="margin-top: 30px;" id="totalAmt">Rs. ${total_amt_data['total']}</div>
                            </button>
                        </div>
                        <!-- Back -->
                        <div class="j-card-back">
                            <img src="/static/img/${jewel.j_material.toLowerCase()}.png" alt="Jewel img">
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
            }
        } else {
            alert(`Inventory is empty`);
        }
    }
}

// Edit functionality
async function editJewel(j_id) {
    const insert_btn_section = document.getElementById("insert_btn_section");
    const form_block = document.getElementById('formBlock');
    const jewel_update = document.getElementById('jewelUpdateSection');
   
    const response = await fetch(`/get_jewel_id/${j_id}`, { method: 'GET' })
    const result = await response.json();
    if (response.ok) {
        let j_data = result.data;
        if (j_data.length > 0) {
            let raw_data = j_data[0]
            document.getElementById('uj_id').innerText = j_id;
            document.getElementById('uj_tag').value = raw_data.j_tag;
            document.getElementById('uj_name').value = raw_data.j_name;
            document.getElementById('uj_material').value = raw_data.j_material;
            document.getElementById('uj_purity').value = raw_data.j_purity;
            document.getElementById('uj_add_item').value = raw_data.j_add_item;
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
        'j_add_item': document.getElementById('uj_add_item').value,
        'j_weight': document.getElementById('uj_weight').value,
        'j_westage': document.getElementById('uj_westage').value,
        'j_making_charge': document.getElementById('uj_making_charge').value,
        'j_gst': document.getElementById('uj_gst').value,
    };
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

// ========================== Price chart section ==========================

// ========== set the price of the price table ==========================

async function save_price(u_id) {
    let priceData = [];

    // Select all table rows inside tbody
    const rows = document.querySelectorAll("#price_table_section tbody tr");

    rows.forEach(row => {
        const material = row.children[1].innerText.trim();  // Material (Gold/Silver)
        const purity = row.children[3].innerText.trim();    // Purity (24k/22k/18k)
        const price = row.children[5].querySelector("input").value; // Price from input field

        if (material && purity && price) {
            priceData.push({ material, purity, price });
        }
    });
    for (var i = 0; i < priceData.length; i++){
        await set_price(priceData[i], u_id)
    }
    location.reload();
}

async function price_chart(u_id) {
    // Select all table rows inside tbody
    const rows = document.querySelectorAll("#price_table_section tbody tr");

    for (const row of rows) {  // Use a for-loop instead of forEach to handle async properly
        const material = row.children[1].innerText.trim();  // Material (Gold/Silver)
        const purity = row.children[3].innerText.trim();    // Purity (24k/22k/18k)
        const priceInput = row.children[5].querySelector("input"); // Get the input field

        try {
            const price = await get_price(u_id, material, purity); // Fetch price from DB
            if (price !== undefined) {
                priceInput.value = price; // Update input field with fetched price
            }
        } catch (error) {
            console.error(`Error fetching price for ${material} ${purity}:`, error);
        }
    }
}

async function get_price(u_id, j_material, j_purity) {
    var url = `/get_price/${u_id}/${j_material}/${j_purity}`
    var response = await fetch(url, {method:'GET'})
    var result = await response.json();
    if (response.ok){
        var data = result.j_price.data[0];
        var j_price = data['price']
        return j_price
    }
    else{
        alert(`Not able to find the price with ${j_material} and ${j_purity}`);
        return
    }
}

async function set_price(data, u_id) {
    try {
        const response = await fetch (`/set_price/${u_id}`, {
            method : 'POST',
            headers : {
                'Content-type' : 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok){
            console.log(result.data)
        }
        else{
            alert('Not able to save the prices to the databases')
        }
    }
    catch (error) {
        console.error('Error:', error);
        alert('An error occurred while connecting to the server.');
    }
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
        'j_add_item': document.getElementById('j_add_item').value,
    };
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
                appendJewelDetails(u_id, jewel_data[0])
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

async function appendJewelDetails(u_id, jewel) {
    // Calculate price details
    const total_amt_data = await total_amt(u_id, jewel)
    const cardHTML = `
        <div class="j-card" onclick="this.classList.toggle('flipped')">
            <div class="j-card-inner">
                <!-- Front -->
                <div class="j-card-front">
                    <div class="edit-btn" onclick="editJewel(${jewel.j_id})">&#9998;</div>
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
                        <div class="j-card-price" style="margin-top: 30px;" id="totalAmt">Rs. ${total_amt_data['total']}</div>
                    </button>
                </div>
                <!-- Back -->
                <div class="j-card-back">
                    <img src="/static/img/${jewel.j_material.toLowerCase()}.png" alt="Jewel img">
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

async function total_amt(u_id, data) {
    let material_price = (await get_price(u_id, data.j_material, data.j_purity)) * data.j_weight;
    let westage = material_price * (data.j_westage / 100);
    let making_charge = (material_price + westage) * (data.j_making_charge / 100);
    let gst = (material_price + westage + making_charge) * (data.j_gst / 100);
    let total = material_price + westage + making_charge + gst + data.j_add_item;
    let without_gst = material_price + westage + making_charge  + data.j_add_item;
    let total_amt_data = {
        'material_price': material_price.toFixed(2),
        'westage': westage.toFixed(2),
        'making_charge': making_charge.toFixed(2),
        'gst': gst.toFixed(2),
        'total': total.toFixed(2),
        'without_gst' : without_gst.toFixed(2)
    }
    console.log(total_amt_data);
    return total_amt_data
}

// ===================================== Billing Chart section ===============================
async function redirectToBilling(j_id) {
    
    // Encode the amount to pass it via URL
    var url = `/billing/${j_id}`;
    
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
};