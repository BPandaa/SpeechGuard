# SpeechGuard

## Overview
SpeechGuard is a browser extension powered by advanced machine learning techniques to detect and classify hate speech on social media platforms. This tool aims to create a safer digital environment by blurring potentially harmful content and empowering users to moderate their online experiences.

## Examples
# Blurred Post 
![image](https://github.com/user-attachments/assets/454b4863-e131-4cf4-8c9f-50eb8173d7d9)

# Unblurred Post 
![image](https://github.com/user-attachments/assets/891fc0f0-e4de-4b01-8165-3dee12cb24b6)


---

## Features
- **Real-Time Hate Speech Detection:** Automatically scans social media posts for hate speech.
- **Content Moderation:** Blurs flagged posts and allows users to unblur them if desired.
- **Machine Learning Integration:** Utilizes logistic regression for accurate classification.
- **User-Friendly Interface:** Intuitive design for seamless interaction.
- **Customizable Settings:** Adaptable to user preferences for moderation.

---

## Key Technologies
- **Frontend:** Chrome Extension (HTML, CSS, JavaScript).
- **Backend:** Flask server for text processing and model integration.
- **Machine Learning:** Logistic Regression for text classification.
- **Data Preprocessing:** Tokenization, stop word removal, and lemmatization.

---

## Prerequisites
### Hardware
- Multi-core processor (i7 or equivalent recommended).
- At least 16GB RAM.
- Minimum 256GB SSD.

### Software
- Python 3.9 or higher.
- Browser (Google Chrome).
- Required Python libraries: `Flask`, `Flask-CORS`, `scikit-learn`, etc.

---

## Installation
### 1. Clone the Repository
```bash
git clone git@github.com:BPandaa/SpeechGuard.git
cd SpeechGuard
```

### 2. Set Up the Machine Learning Model
1. Navigate to the project directory:
   ```bash
   cd ml_model
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Train or load the model by running the notebook:
   ```bash
   jupyter notebook ai.ipynb
   ```

### 3. Run the Flask Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   pip install flask flask-cors
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```

### 4. Install the Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer Mode**.
3. Click **Load Unpacked** and select the extension folder in the repository.

---

## Usage
1. Launch the Flask server.
2. Activate the SpeechGuard extension in Chrome.
3. Browse Twitter or other supported social media platforms.
4. Posts containing hate speech will be automatically blurred with an option to unblur.

---

## Testing
- Button functionalities (Blur and Unblur).
- Integration between the browser extension and the backend server.
- Model accuracy for detecting hate speech.

---

## Future Enhancements
- Expand support to additional social media platforms.
- Integrate advanced NLP techniques like BERT for improved accuracy.
- Implement a feedback loop for real-time learning and adaptive improvement.

---

## Author
**Badr Adnani**
- University of Sunderland
- BSc (Hons) Computer Science

For any queries or contributions, feel free to contact via GitHub.
