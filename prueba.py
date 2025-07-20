import bcrypt
password = b"Prueba123"
hashed = bcrypt.hashpw(password, bcrypt.gensalt())
print(hashed.decode())