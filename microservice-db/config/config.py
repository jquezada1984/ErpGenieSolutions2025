import os
from dotenv import load_dotenv

load_dotenv()
 
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:XeCWl8Dam9CNUS1m@db.xfeycgctysoumclptgoh.supabase.co:5432/postgres?sslmode=require')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecret')
    
    # Configuración CORS - Gateway API
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',') 