from flask import Flask, jsonify,render_template,flash,request,redirect,session, url_for
from db_files.users import Users
from db_files.inventory import Inventory
from flask_cors import CORS

db = Users()
inventory = Inventory()     
app = Flask(__name__)
CORS(app)
app.secret_key = "Aru.8967"

@app.route('/')
def root():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form["name"]
        password = request.form["password"]
        row_data = db.get_user(name)
        user_data = row_data['data'][0]
        session["user_data"] = user_data
        if row_data["status"] == 200:
            if user_data['u_password'] == password:
                return redirect(f'/home/{user_data["id"]}')
            else:
                msg = "Incurrect password"
                return render_template ("login.html", msg = msg)
        else:
            msg = "User not Found"
            return render_template ("login.html", msg = msg)      
    return render_template ("login.html", msg = None)

@app.route('/home/<int:id>')
def home(id):
    if session.get("user_data"):
        user_data = session.get("user_data")
        data = {
            'user':user_data
        }
        if user_data:
            return render_template("home.html", data=data)
        else:
            return redirect("/login")
    else:
        return redirect("/login")

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        c_name = request.form['c_name']
        pass1 = request.form['password1']
        pass2 = request.form['password2']
        user_present = True if db.get_user(name)['status'] == 200 else False
        if not user_present:
            if pass1 == pass2:
                data = {
                    "u_name":name,
                    "u_company_name":c_name,
                    "u_password":pass1
                }
                new_user = db.set_user(data)
                if new_user['status'] == 200:
                    msg = "New User created please login"
                    return render_template("login.html", msg = msg)
                else:
                    msg = new_user['data'] 
                    return render_template("login.html", msg = msg)
            else:
                msg = "Password and Conform Password not matching"
                return render_template("login.html", msg = msg)

        else:
            msg = "user already present please login"
            return render_template("login.html", msg = msg)
    return render_template("login.html", msg = None)

@app.route('/insert_jewel', methods=['POST'])
def insert_jewel():
    try:
        data = request.json
        print(data)
        jewel_details = inventory.insert_jewel(data)
        print(jewel_details)
        return jsonify(jewel_details)
    except Exception as e:
        return jsonify({'status': 500, 'error': str(e)})
    
@app.route('/get_jewel_tag', methods=['POST'])
def get_jewel_tag():
    try:
        data = request.json
        get_jewel = inventory.get_by_jeweL_tag(data)
        return jsonify(get_jewel)
    except Exception as e:
        return jsonify({'status':500, 'error':str(e)})

@app.route('/get_jewel_id/<int:j_id>', methods=['GET'])
def get_jewel_id(j_id):
    try:
        get_jewel = inventory.get_by_jewel_id(j_id)
        return jsonify(get_jewel)
    except Exception as e:
        return jsonify({'status':500, 'error':str(e)})
    
@app.route('/get_all_data_by_id/<int:u_id>', methods=['GET'])
def get_all_data_by_id(u_id):
    try:
        all_data = inventory.get_all_by_userid(u_id)
        print("all data fetched")
        return jsonify(all_data)
    except Exception as e:
        return jsonify({'status':500, 'error':str(e)})
    
@app.route('/update_jewel_id/<int:j_id>', methods=['POST'])
def update_jewel_id(j_id):
    try:
        data = request.json
        update_jewel = inventory.update_by_jewel_id(data, j_id)
        print({'data' : data, 'j_id' : j_id, 'j_id type' : type(j_id)})
        print(update_jewel)
        return jsonify(update_jewel)
    except Exception as e:
        return jsonify({'status':500, 'error':str(e)})

@app.route('/delete_jewel_id/<int:j_id>', methods=['DELETE'])
def delete_jewel_id(j_id):
    try:
        delete_jewel = inventory.delete_by_jewel_id(j_id)
        print(delete_jewel)
        return jsonify(delete_jewel)
    except Exception as e:
        return jsonify({'status':500, 'error':str(e)})


@app.route('/test')
def test():
    if session.get("user_data"):
        user_data = session.get("user_data")
        data = {
            'user':user_data
        }
        if user_data:
            return render_template("test.html", data=data)
        else:
            return redirect("/login")
    else:
        return redirect("/login")

@app.route('/logout')
def logout():
    session.clear()
    return redirect('login')

if __name__ == '__main__':
    app.run(debug=True, port=80)