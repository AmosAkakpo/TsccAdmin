from flask_sqlalchemy import SQLAlchemy
from api import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

class DbhHeightCarbonEstimation(db.Model):
    location = db.Column(db.String(80), primary_key=True)
    dbh = db.Column(db.Float, nullable=True)
    height = db.Column(db.Float, nullable=True)
    abg = db.Column(db.Float, nullable=True)
    number_of_tree = db.Column(db.Integer, nullable=True)
    total_biomass = db.Column(db.Float, nullable=True)
    total_dry_weight = db.Column(db.Float, nullable=True)
    total_carbon = db.Column(db.Float, nullable=True) 
    co2_weight = db.Column(db.Float, nullable=True) 



class ImageUploaded(db.model):
    image_file = db.Column(db.String(20),nullable=False)