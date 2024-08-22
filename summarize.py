# Importing modules
from flask import Flask, request, jsonify
import logging
import pandas as pd

# Setting up logging
logging.basicConfig(level=logging.DEBUG)

# Defining flask objectpo
app = Flask(__name__)
@app.route('/process', methods=['POST']) # Sending data to the server

# Processing data
def process_data():
    # Log incomming data
    #logging.debug("Recieved request: %s", request.data)

    print("In server")

    try:
        # Extracting data
        data = request.json
        header_content_pairs = data.get('headerContentPairs', [])

        # Converting to pandas dataframe
        df = pd.DataFrame(header_content_pairs)
        print(df)

        # Response back to application
        return jsonify({
            "message": "Data Recieved successfully",
            "Content": header_content_pairs
        }), 200

    
    except Exception as e:
        # Logging errors that occur
        logging.error("Error processing request: %s", str(e))
        return jsonify({"error", "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port =8080, debug=True)