from flask import Flask, make_response, request
import joblib
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string
from flask_cors import CORS, cross_origin

# Initialize Flask app and CORS
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Stopwords and lemmatizer
stopword = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def cleanText(text):
    text = str(text).lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = [word for word in text.split() if word not in stopword]
    text = " ".join(text)
    text = [lemmatizer.lemmatize(word) for word in text.split()]
    text = " ".join(text)
    return text

# Load the model and vectorizer
reg = joblib.load('Model/regression_model.joblib')
cv = joblib.load('Model/vectoriser.joblib')

print(reg)

# Route to handle GET request and respond with "Hello"
@app.route('/', methods=['GET'])
def hello():
    return "Hello! Your Flask app is running!"

# Route to handle POST request
@app.route('/', methods=['POST'])
@cross_origin()
def form_example():
    text = request.data.decode("utf-8")
    print(text)
    result = reg.predict(cv.transform([cleanText(text)]))[0]
    response = make_response(str(result), 200)
    response.mimetype = "text/plain"
    return response

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
