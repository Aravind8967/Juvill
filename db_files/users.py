import mysql
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

class Users:
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

    def get_all_users(self):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM users"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q)
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}
        
    
    def get_userid(self, id):
        db = self.db_connection()
        if db['status'] == 200:
            try:
                con = db['connection']
                q = "SELECT * FROM users WHERE id = %s;"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (id,))
                data = cursor.fetchall()
                if data:
                    return {'status':200, 'data':data}
                else:
                    return {'status':404, 'data':'user not found'}
            except:
                return {'status':404, 'data':'user not found'}
        else:
            return {'status':404, 'data':'user not found'}

    def get_user(self, name):
        db = self.db_connection()
        if db['status'] == 200:
            try:
                con = db['connection']
                q = "SELECT * FROM users WHERE u_name = %s;"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (name,))
                data = cursor.fetchall()
                if data:
                    return {'status':200,'data':data}
                else:
                    return {'status':404, 'data':'user not found'}
            except:
                    return {'status':404, 'data':'user not found'}
        else:
            return {'status':db['status'], 'data':db['data']}
     
    def set_user(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            try:
                con = db['connection']
                q = "INSERT INTO users (u_name, u_company_name,u_password, gst_no) VALUES (%s, %s, %s, %s);"
                cursor = con.cursor(dictionary=True)
                cursor.execute(q, (data['u_name'],data['u_company_name'], data['u_password'], data['gst_no']))
                db['connection'].commit()
                return {'status':200, 'data':'New user created'}
            except:
                return {'status':404, 'data':'Not able to create new user'}
        else:
            return {'status':404, 'data':'database connection error'}
        
    def delete_user(self, id):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            cursor = con.cursor()
            q = "DELETE FROM USERS WHERE id = %s"
            cursor.execute(q, (id,))
            con.commit()
            return {'status':200, 'data':'User account deleted'}
        else:
            return {'status':404, 'data':'Not able to delete user'}

    def update_user(self, data):
        db = self.db_connection()
        if db["status"] == 200:
            con = db["connection"]
            cursor = con.cursor()
            q = "UPDATE USERS SET u_name = %s, u_company_name = %s,u_password = %s WHERE id = %s"
            cursor.execute(q, (data['u_name'], data['u_company_name'], data['u_password'], data['id']))
            con.commit()
            return {'status':200, 'data':'User account updated'}
        else:
            return {'status':404, 'data':'Not able to Update user'}


    def truncate_table(self):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "TRUNCATE TABLE USERS"
            cursor = con.cursor()
            cursor.execute(q)
            con.commit()
            return {'status':200, 'data':'Truncate successfully'}
        

def get_all_users():
    users = Users()
    for user in users.get_all_users()['data']:
        print(user)

if __name__ == '__main__':
    users = Users()
    data = {
        'id' : 2,
        'u_name' : 'Varun',
        'u_company_name' : 'Varun jewel shope',
        'u_password' : '1234'
    }

    print(users.get_user('Aravind'))