from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

app = FastAPI(title="TrabaHome Local AI Service", version="1.0")

# Allow calls from backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def decode_image(file_bytes: bytes):
    arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def blur_variance(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()


def detect_face(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    return len(faces)


def assess_images(valid_id_img, selfie_img):
    issues = []
    # Blur check
    id_blur = blur_variance(valid_id_img)
    selfie_blur = blur_variance(selfie_img)
    blur_threshold = 80.0
    if id_blur < blur_threshold:
        issues.append(f"Valid ID image is blurry (var={id_blur:.1f})")
    if selfie_blur < blur_threshold:
        issues.append(f"Selfie image is blurry (var={selfie_blur:.1f})")

    # Face detection on selfie
    faces = detect_face(selfie_img)
    if faces == 0:
        issues.append("No face detected in selfie")
    elif faces > 1:
        issues.append("Multiple faces detected in selfie")

    status = "passed" if not issues else "failed"
    return status, issues


@app.post("/verify")
async def verify(valid_id: UploadFile = File(...), selfie: UploadFile = File(...)):
    try:
        id_bytes = await valid_id.read()
        selfie_bytes = await selfie.read()
        id_img = decode_image(id_bytes)
        selfie_img = decode_image(selfie_bytes)
        status, issues = assess_images(id_img, selfie_img)
        return {"aiStatus": status, "aiIssues": issues}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=False)
