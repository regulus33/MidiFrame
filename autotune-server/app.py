from flask import Flask, render_template, request
import os
import random
from tune_file import tune_file
from werkzeug.utils import secure_filename
import code

app = Flask(__name__)
temp = f'{app.root_path}/tmp'
app.config['UPLOAD_FOLDER'] = temp
# app.config['MAX_CONTENT_PATH'] = 10000000000


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        f = request.files['file']
        input_file = secure_filename(f.filename)
        code.interact(local=dict(globals(), **locals()))
        input_full_path = f'{temp}/{input_file}'
        f.save(input_full_path)
        tune_file(input_full_path, "c")

        return 'file uploaded successfully'
    else:
        return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
