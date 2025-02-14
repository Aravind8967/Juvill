import mysql
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

class Price_table:
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
        
    def get_all_price(self):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT * FROM price_table"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q)
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}

    def get_price(self, data):
        db = self.db_connection()
        if db['status'] == 200:
            con = db['connection']
            q = "SELECT price FROM price_table WHERE u_id = %s AND material = %s AND purity = %s"
            cursor = con.cursor(dictionary=True)
            cursor.execute(q, (data['u_id'], data['material'], data['purity']))
            data = cursor.fetchall()
            return {'status':200, 'data':data}
        else:
            return {"status":db["status"], "data":db["data"]}

    def set_price(self, data, u_id):
        db = self.db_connection()
        if db["status"] == 200:
            con = db["connection"]
            cursor = con.cursor()
            q = "UPDATE price_table SET price = %s WHERE u_id = %s AND material = %s AND purity = %s"
            cursor.execute(q, (data['price'], u_id, data['material'], data['purity']))
            con.commit()
            return {'status':200, 'data':'Price updated updated'}
        else:
            return {'status':404, 'data':'Not able to update price'}

    def new_price_chart(self, u_id):
        db = self.db_connection()
        if db["status"] == 200:
            con = db["connection"]
            cursor = con.cursor()
            q = f'''
                INSERT INTO price_table (u_id, material, color, purity, weight, price) 
                VALUES 
                ({u_id}, 'Gold', 'Gold', '24k', 1, 8000), 
                ({u_id}, 'Gold', 'Gold', '22k', 1, 7600),
                ({u_id}, 'Gold', 'Gold', '18k', 1, 7000),
                ({u_id}, 'Silver', 'Silver', '24k', 1, 1000),
                ({u_id}, 'Silver', 'Silver', '22k', 1, 900),
                ({u_id}, 'Silver', 'Silver', '18k', 1, 800);

            '''
            cursor.execute(q)
            con.commit()
            return {'status':200, 'data':'new price table created'}
        else:
            return {'status':404, 'data':'Not able to update price'}
        
if __name__ ==  '__main__':
    p_table = price_table()
    pt = p_table.get_all_price()
    data = {
        'u_id' : 9,
        'price' : 8,
        'material' : 'gold',
        'purity' : '24k'
    }
    print(p_table.get_price(data))
    # print(p_table.get_price('Gold', '24k')['data'][0]['price'])