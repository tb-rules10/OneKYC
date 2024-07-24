import requests
from PIL import Image
from io import BytesIO
import pytesseract
import re

def verify_details(aadhaar_number: str, data: dict, database: dict) -> bool:
    if aadhaar_number not in database:
        return False
    
    stored_data = database[aadhaar_number]
    
    stored_data_dict = {
        "name": stored_data[0],
        "phonenum": stored_data[1],
        "aadhaar": stored_data[2],
        "location": stored_data[3],
        "photoUrl": stored_data[4],
        "docUrl": stored_data[5]
    }
    
    return (
        stored_data_dict["name"] == data.get("name") and
        stored_data_dict["phonenum"] == data.get("phonenum") and
        stored_data_dict["aadhaar"] == data.get("aadhaar") and
        stored_data_dict["location"] == data.get("location")
    )

def download_image(pinata_url: str) -> Image.Image:
    response = requests.get(pinata_url)
    
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        return image
    else:
        raise Exception(f"Failed to download image: {response.status_code}")

def ocr_image(image: Image.Image) -> str:
    return pytesseract.image_to_string(image)

def extract_aadhaar_info(ocr_text: str) -> dict:
    aadhaar_pattern = re.compile(r'\b\d{4}\s\d{4}\s\d{4}\b')
    aadhaar_number = aadhaar_pattern.search(ocr_text)

    name_pattern = re.compile(r'Name\s*:\s*([A-Za-z ]+)')
    name = name_pattern.search(ocr_text)

    location_pattern = re.compile(r'Address\s*:\s*([\w\s,]+)')
    location = location_pattern.search(ocr_text)

    return {
        "aadhaar": aadhaar_number.group() if aadhaar_number else None,
        "name": name.group(1) if name else None,
        "location": location.group(1) if location else None,
    }
