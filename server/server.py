from flask import Flask, jsonify
from flask_cors import CORS

# app instance
app = Flask(__name__)
CORS(app)

@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message' : "Hello Made an PAI!",
        'people': ['Jack', 'Mary', 'BErry']
    })


if __name__ == "__main__":
    app.run(debug=True, port=8000) # remove debug if you are deploying to production
