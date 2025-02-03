from db_files.users import Users
from db_files.inventory import Inventory
from db_files.price_table import price_table
from flask_cors import CORS

db = Users()
inventory = Inventory()     
p_table = price_table()


def get_price(u_id, j_material, j_purity):
    data = {
        'u_id' : u_id,
        'material' : j_material,
        'purity' : j_purity
    }
    j_price = p_table.get_price(data)
    data = {
        'j_price' : j_price
    }
    return data

if __name__ == '__main__':
    print(get_price(9, 'Gold', '22k'))