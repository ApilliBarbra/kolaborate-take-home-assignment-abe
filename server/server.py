from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
import psycopg2
from flask_cors import CORS

# app instance
app = Flask(__name__)
CORS(app)

# Database connection details
DB_HOST = "5342"
DB_NAME = "profiles_db"
DB_USER = "postgresql_user"
DB_PASSWORD = "password1"

# connect to PostgreSQL db
conn = psycopg2.connect(
    host=DB_HOST,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)

db_cursor = conn.cursor()

# Configure the PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost:5432/your_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Profile model
class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String, nullable=False)
    skills = db.Column(db.ARRAY(db.String), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    availableForWork = db.Column(db.Boolean, nullable=False, default=True)
    hourlyRate = db.Column(db.Integer, nullable=False)

"""
    CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        location TEXT NOT NULL,
        skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        experience_years NUMERIC(4,1) NOT NULL CHECK (experience_years >= 0),
        available_for_work BOOLEAN NOT NULL,
        hourly_rate NUMERIC(10,2) NOT NULL CHECK (hourly_rate >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
"""

@app.route("/api/profiles", methods=['POST'])
def create_profile():
    try:
        # get profile data
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        location = data.get("location")
        skills = data.get("skills")
        experienceYears = data.get("experience")
        availableForWork = data.get("availableForWork")
        hourlyRate = data.get("hourlyRate")
        
        if not name or email:
            return jsonify({"error": "Name and email are required"}), 400

        # Insert data into the database
        query = """
                    INSERT INTO profiles
                        (name, email, location, skills, experience_years, available_for_work, hourly_rate)
                    VALUES
                        (%s, %s, %s, %s::jsonb, %s, %s, %s)
                    RETURNING id, name, email, location, skills, experience_years AS "experienceYears",
                              available_for_work AS "availableForWork", hourly_rate AS "hourlyRate", created_at;
                    """
        db_cursor.execute(query, (name, email, location, skills, experienceYears, availableForWork, hourlyRate))
        conn.commit()

        # Close the connection
        db_cursor.close()
        conn.close()

        return jsonify({"message": "Profile saved successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500    


@app.route("/api/profiles", methods=['GET'])
def get_profiles():
    try:
        # Execute query to fetch profiles
        db_cursor.execute("SELECT * FROM profiles;")
        profiles = db_cursor.fetchall()

        # Format the result as a list of dictionaries
        result = [
            {"id": row[0], "name": row[1], "email": row[2], "location":row[3],
             "skills":row[4], "experience":row[5], "availableForWork":row[6], "hourlyRate":row[7]} for row in profiles
        ]

        # Close the connection
        db_cursor.close()
        conn.close()

        # Return the result as JSON
        return jsonify(result), 200

    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500


@app.route("/api/profiles/<int:id>", methods=['GET'])
def get_dev_profile(id):
    profile = Profile.query.get(id)
    if not profile:
        abort(404, description="Profile not found")
        
    return jsonify({
        'id': profile.id,
        'name': profile.name,
        'email': profile.email,
        'location': profile.location,
        'skills': profile.skills,
        'experience': profile.experience,
        'availableForWork': profile.availableForWork,
        'hourlyRate': profile.hourlyRate
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)
