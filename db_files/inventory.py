import mysql
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

class Inventory:
    def db_connection(self):
        try:
            db_connection = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
            status = 200
            return {'connection':db_connection, 'status':status}
        except:
            status = 404
            return {'status':status, 'data':'database connection error'}
        
    def get_all(self):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM inventory"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q)
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}
    
    def get_all_by_userid(self, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM inventory WHERE u_id=%s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (u_id,))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}
        
    def insert_jewel(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            try:
                con = db['connection']
                q = "INSERT INTO inventory (u_id, j_tag, j_name, j_material, j_purity, j_weight, j_westage, j_making_charge, j_gst) VALUES (%s,%s,%s,%s,%s,%s,%s, %s, %s);"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (data['u_id'],data['j_tag'], data['j_name'], data['j_material'], data['j_purity'], data['j_weight'], data['j_westage'], data['j_making_charge'], data['j_gst']))
                db['connection'].commit()
                return {'status':200, 'data':'New Jewelery inserted to inventory'}
            except:
                return {'status':404, 'data':'Not able to insert Jewel to inventory'}
        else:
            return {'status':404, 'data':'database connection error'}   

    def get_by_jeweL_tag(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM inventory WHERE j_tag=%s and u_id=%s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (data['j_tag'], data['u_id']))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}

    def get_by_jewel_id(self, j_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM inventory WHERE j_id=%s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (j_id,))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}

    def update_by_jewel_id(self, data, j_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "UPDATE inventory SET j_tag=%s, j_name=%s, j_material=%s, j_purity=%s, j_weight=%s, j_westage=%s, j_making_charge=%s, j_gst=%s WHERE j_id=%s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (data['j_tag'], data['j_name'], data['j_material'], data['j_purity'], data['j_weight'], data['j_westage'], data['j_making_charge'], data['j_gst'], j_id))
            con.commit()
            return {'status':200, 'data':'Jewel details Updated'}
        else:
            return {"status":db["status"], "data":db["data"]}

    def delete_by_jewel_id(self, j_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "DELETE FROM inventory WHERE j_id = %s;"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (j_id,))
            con.commit()
            return {'status':200, 'data':'Jewel details Deleted.'}
        else:
            return {"status":db["status"], "data":db["data"]}

    def truncate_by_uid(self, u_id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "DELETE FROM inventory WHERE u_id = %s;"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (u_id,))
            con.commit()
            return {'status':200, 'data':'All Inventory removed'}
        else:
            return {"status":db["status"], "data":db["data"]}
        

def get_all():
    inventory = Inventory()
    for item in inventory.get_all()['data']:
        print(item)

def get_by_userid(u_id):
    inventory = Inventory()
    for item in inventory.get_all_by_userid(u_id)['data']:
        print(item)

def insert_jewel(data):
    inventory = Inventory()
    print(inventory.insert_jewel(data))

def truncate_byid(u_id):
    inventory = Inventory()
    print(inventory.truncate_by_uid(u_id))

if __name__ == '__main__':
    inventory = Inventory()
    data = {
        'u_id' : 2,
        'j_tag' : 101,
        'j_name' : 'Ring',
        'j_material' : 'Gold', 
        'j_purity' : '22K', 
        'j_amount' : 2000, 
        'j_weight' : 2.5
    }
    data = inventory.get_all_by_userid(7)
    for i in data['data']:
        print(i)