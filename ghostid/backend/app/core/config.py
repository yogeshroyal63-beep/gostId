import os
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH", "../ml/models/ghostid_model.onnx")
PORT = int(os.getenv("PORT", 8000))
