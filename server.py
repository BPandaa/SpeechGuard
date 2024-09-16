from flask import Flask, make_response, request
import joblib
import re
from nltk.corpus import stopwords
from nltk.stem import *
import string
stopword = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
from flask_cors import CORS, cross_origin



def cleanText(text):
    text = str(text).lower()
    text = re.sub('', '', text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    text = [word for word in text.split() if word not in stopword]
    text = " ".join(text)
    text = [lemmatizer.lemmatize(word) for word in text.split()]
    text = " ".join(text)
    return text


reg = joblib.load('regression_model.joblib')
cv = joblib.load('vectoriser.joblib')

print(reg)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



@app.route('/', methods=['POST'])
@cross_origin()
def form_example():
    text = request.data.decode("utf-8")
    
    print(text)
    result = reg.predict(cv.transform([cleanText(text)]))[0]
    response = make_response(str(result), 200)
    response.mimetype = "text/plain"
    return response


if __name__ == '__main__':
    app.run(debug=True)
