from flask import Flask, jsonify

app = Flask(__name__)

# Dummy list of members
members = [
    {"id": 1, "name": "John Doe", "age": 30},
    {"id": 2, "name": "Jane Smith", "age": 25},
    {"id": 3, "name": "Michael Johnson", "age": 40}
]

@app.route('/members', methods=['GET'])
def get_members():
    return jsonify(members)

if __name__ == '__main__':
    app.run(debug=True)
