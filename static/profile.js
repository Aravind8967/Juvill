// Update Profile
async function updateProfile(u_id) {
    console.log('update profile btn pressed')
    let companyName = document.getElementById("company_name").value;
    let gstNo = document.getElementById("gst_no").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    var data = {
        'u_id': u_id,
        'u_company_name': companyName,
        'gst_no': gstNo,
        'u_name': username,
        'u_password': password
    };
    console.log(data);
    try {
        const response = await fetch(`/${u_id}/update_profile`, {
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

async function deleteProfile(u_id){
    console.log('delete btn pressed');
    var url = `/${u_id}/delete_profile`
    var response = await fetch(url, {method : 'DELETE'});
    const result = await response.json();
    if (response.ok){
        alert("Profile deleted successfully!");
        window.location.href = '/logout';
    }
    else {
        alert("Failed to delete profile.");
    }
}

function profile_test() {
    console.log('profile.js file is attached')
}