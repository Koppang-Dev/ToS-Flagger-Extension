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

    try:
        # Extracting data
        data = request.json
        content = data.get('content')
        headers = data.get('headers')

        table_df = create_table(content, headers)

        # Printing our dataframe
        print("Data Frame: %s", table_df)


        # Summarizing the content

        # 
        summarized_content = summarized_content(content)
        #logging.debug("Summary: %s", summarized_content)

        # Response back to application
        return jsonify({
            "message": "Data Recieved successfully",
            "summarized_content": summarized_content
        }), 200

    
    except Exception as e:
        # Logging errors that occur
        logging.error("Error processing request: %s", str(e))
        return jsonify({"error", "Internal Server Error"}), 500


def create_table(content, headers):
    # Create a dataframe using the headers and content
    df = pd.DataFrame([content], columns=headers)
    return df

if __name__ == '__main__':
    app.run(host='127.0.0.1', port =8080, debug=True)