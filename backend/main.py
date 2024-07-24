from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from functions import verify_details, download_image
import face_recognition
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('data.json', 'r') as file:
    database = json.load(file)

@app.get("/")
async def root():
    return {"message": "Hello World", "data": database}

@app.post("/verify")
async def verify(req: Request):
    data = await req.json()
    print(data)
    aadhaar_number = data.get('aadhaar')

    if aadhaar_number not in database:
        return {"status": False, "reason": "Person not found in database"}

    if not verify_details(aadhaar_number, data, database):
        return {"status": False, "reason": "Person details do not match database"}

    user_photo_url = data.get('photoUrl')
    stored_photo_url = database[aadhaar_number][4]

    try:
        user_photo = download_image(user_photo_url)
        stored_photo = download_image(stored_photo_url)
    except Exception as e:
        return {"status": False, "reason": str(e)}

    # Convert images to bytes-like objects for face recognition
    user_photo_bytes = BytesIO()
    user_photo.save(user_photo_bytes, format=user_photo.format)
    user_photo_bytes.seek(0)

    stored_photo_bytes = BytesIO()
    stored_photo.save(stored_photo_bytes, format=stored_photo.format)
    stored_photo_bytes.seek(0)

    # Load images using face_recognition
    user_photo_array = face_recognition.load_image_file(user_photo_bytes)
    stored_photo_array = face_recognition.load_image_file(stored_photo_bytes)

    # Encode faces
    user_face_encoding = face_recognition.face_encodings(user_photo_array)
    stored_face_encoding = face_recognition.face_encodings(stored_photo_array)

    if len(user_face_encoding) == 0 or len(stored_face_encoding) == 0:
        return {"status": False, "reason": "Could not detect face in one of the photos"}

    # Compare faces
    match_results = face_recognition.compare_faces([stored_face_encoding[0]], user_face_encoding[0])
    face_distance = face_recognition.face_distance([stored_face_encoding[0]], user_face_encoding[0])

    face_match_percentage = (1 - face_distance[0]) * 100

    if match_results[0]:
        return {"status": True, "face_match_percentage": face_match_percentage}
    else:
        return {"status": False, "reason": "Faces do not match", "face_match_percentage": + face_match_percentage}

