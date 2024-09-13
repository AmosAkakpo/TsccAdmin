from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import uuid
import numpy as np
import cv2
import io
from ultralytics import YOLO
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
CORS(app)



# Define the allometric equations 
allometric_equations = {
    'Azadirachta indica': lambda D, H: 0.810 * np.log(D**2 * H) + 0.487,
    'Bauhinia racemosa': lambda D=None, H=None, p=None : 1.689 + 0.704 * np.log(D) + 1.392 * np.log(H),
    'Bridelia retusa': lambda D, H: 0.81 * np.log(D**2 * H) + 0.513,
    'Butea monosperma': lambda D, H: 1.132 * np.log(D**2 * H) + 2.478,
    'Cassia fistula': lambda D, H: 0.863 * np.log(D**2 * H) + 0.517,
    'Cassia siemia': lambda D, H: 1.261 * np.log(D**2 * H) - 0.379,
    'Dalbergia paniculata': lambda D, H: 0.760 * np.log(D**2 * H) + 0.331,
    'Delonix regia':lambda D=None, H=None, p=None: 0.777 * np.log(D**2 * H) + 0.535,
    'Royal poinciana':lambda D=None, H=None, p=None: 0.777 * np.log(D**2 * H) + 0.535,
    'Diospyros melanoxylon': lambda D, H: 0.961 * np.log(D**2 * H) + 0.210,
    'Ehretia laevis': lambda D, H: 0.608 * np.log(D**2 * H) + 0.927,
    'Flacourtia indica': lambda D, H: 0.667 * np.log(D**2 * H) + 0.332,
    'Gliricidia sepium': lambda D, H: 0.768 * np.log(D**2 * H) + 0.375,
    'Grewia asiatica': lambda D, H: 0.741 * np.log(D**2 * H) + 0.422,
    'Holarrhena antidysenterica': lambda D, H: 0.612 * np.log(D**2 * H) + 1.013,
    'Leucaena leucocephala':lambda D=None, H=None, p=None: 1.350* np.log(D**2) - 2.210,
    'Melia azadirech':lambda D=None, H=None, p=None:0.677 * np.log(D**2 * H) + 1.158 ,
    'Mitragyna parvifolia':lambda D=None, H=None, p=None: 1.772+0.725* np.log(D)+0.647* np.log(H)- 0.115* np.log(p),
    'Pongamia pinnata':lambda D=None, H=None, p=None: 1.187+1.107* np.log(D)+0.980* np.log(H),
    'Santalum album':lambda D=None, H=None, p=None: 0.922 * np.log(D**2 * H)- 0.113,
    'Tectona grandis': lambda D=None, H=None, p=None: 0.714 * np.log(D**2 * H) + 0.958,
    'Wrightia tinctoria':lambda D=None, H=None, p=None: 0.718 * np.log(D**2 * H) + 0.666,
    'Ziziphus jujuba': lambda D=None, H=None, p=None: 0.813 * np.log(D**2 * H) + 0.692 ,
    'General equation':lambda D=None, H=None, p=None:- 0.103+1.766* np.log(D)+0.508* np.log(H),
}

def calculateCarbonEstimation(row):
    species = row['Species']
    D = row['DBH']
    H = row['Height']
    
    if species in allometric_equations:
        ln_agb = allometric_equations[species](D, H)
    else:
        ln_agb = allometric_equations['General equation'](D, H)

    agb = (np.exp(ln_agb))/1000
    total_biomass = agb * 1.2
    total_dry_weight = total_biomass * 0.725
    total_carbon = total_dry_weight * 0.5
    c02_weight = total_carbon * 0.5

    return pd.Series([ln_agb, agb, total_biomass, total_dry_weight, total_carbon, c02_weight])

@app.route('/carbonEstimation', methods=['POST'])
def carbon_estimation():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        # Read the uploaded file
        df = pd.read_csv(file)
        
        # Apply the calculation to each row
        df[['ln(AGB)', 'AGB', 'Total biomass', 'Total dry weight', 'Total Carbon', 'C02 weight']] = df.apply(calculateCarbonEstimation, axis=1)
        
        # Calculate the sum of each relevant column
        summary_data = df[['AGB', 'Total biomass', 'Total dry weight', 'Total Carbon', 'C02 weight']].sum().to_dict()
        
        # Use a static filename for the processed file
        output_file = 'processed_file.xlsx'
        
        # Save the updated dataframe and summary to a new Excel file
        with pd.ExcelWriter(output_file) as writer:
            df.to_excel(writer, sheet_name='Data', index=False)
            summary_df = pd.DataFrame([summary_data])
            summary_df.to_excel(writer, sheet_name='Summary', index=False)
        
        # Return the summary and the download URL
        file_url = f'/download?filename={output_file}'
        
        return jsonify({
            "summary": summary_data,
            "file_url": file_url
        })
    
@app.route('/download', methods=['GET'])
def download_file():
    filename = request.args.get('filename')
    return send_file(filename, as_attachment=True)

#for the carbon credit and factors
class CarbonCreditCalculator:
    def __init__(self, base_carbon_credits):
        # Convert base_carbon_credits to float to ensure it's a number
        self.base_carbon_credits = float(base_carbon_credits)
        self.multipliers = {
            'rarity': 1.0,
            'endangered_species': 1.0,
            'location': 1.0,
            'biodiversity': 1.0,
        }

    def set_rarity_multiplier(self, rarity_level):
        multipliers = {
            'high': 1.15,
            'medium': 1.10,
            'low': 1.05,
            'none': 1.00
        }
        self.multipliers['rarity'] = multipliers.get(rarity_level.lower(), 1.00)

    def set_endangered_species_multiplier(self, endangerment_level):
        multipliers = {
            'critically_endangered': 1.20,
            'endangered': 1.10,
            'vulnerable': 1.05,
            'none': 1.00
        }
        self.multipliers['endangered_species'] = multipliers.get(endangerment_level.lower(), 1.00)

    def set_location_multiplier(self, location_type):
        multipliers = {
            'rainforest': 1.15,
            'savanna': 1.05,
            'desert': 0.90,
            'urban': 0.80
        }
        self.multipliers['location'] = multipliers.get(location_type.lower(), 1.00)

    def set_biodiversity_multiplier(self, biodiversity_level):
        multipliers = {
            'high': 1.15,
            'medium': 1.10,
            'low': 1.05,
            'none': 1.00
        }
        self.multipliers['biodiversity'] = multipliers.get(biodiversity_level.lower(), 1.00)

    def calculate_total_credits(self):
        total_multiplier = 1.0
        for key in self.multipliers:
            total_multiplier *= self.multipliers[key]
        total_credits = self.base_carbon_credits * total_multiplier*100
        return total_credits

@app.route('/calculateCarbonCredits', methods=['POST'])
def calculate_carbon_credits():
    data = request.json
    base_credits = (float(data['base_credits'])/1000)  # Ensure this is a floa
    
    calculator = CarbonCreditCalculator(base_credits)
    calculator.set_rarity_multiplier(data['rarity'])
    calculator.set_endangered_species_multiplier(data['endangered_species'])
    calculator.set_location_multiplier(data['location'])
    calculator.set_biodiversity_multiplier(data['biodiversity'])

    total_credits = calculator.calculate_total_credits()

    return jsonify({'total_credits': total_credits})


#tree species identification 

model = YOLO('best.pt')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_on_image(image_stream):
    image = cv2.imdecode(np.asarray(bytearray(image_stream.read()), dtype=np.uint8), cv2.IMREAD_COLOR)
    results = model.predict(image, classes=0, conf=0.5)
    for i, r in enumerate(results):
        im_bgr = r.plot(conf=False)
    return im_bgr

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return {"error": "No file found"}, 400

    file = request.files['file']

    if file.filename == '':
        return {"error": "No selected file"}, 400

    if file and allowed_file(file.filename):
        predicted_image = predict_on_image(file.stream)

        retval, buffer = cv2.imencode('.png', predicted_image)
        image_io = io.BytesIO(buffer)

        return send_file(image_io, mimetype='image/png')

    return {"error": "Invalid file format"}, 400


if __name__ == '__main__':
    app.run(debug=True)