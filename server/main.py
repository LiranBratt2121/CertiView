import io
import imagehash
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Image Hashing API",
    description="A simple API to calculate the perceptual hash of an uploaded image.",
    version="1.0.0"
)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/phash")
async def get_phash(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Expected an image, but received '{file.content_type}'."
        )

    try:
        contents = await file.read()
        image_stream = io.BytesIO(contents)
        
        image = Image.open(image_stream)
        
        p_hash = str(imagehash.phash(image))
        
        return JSONResponse(content={"phash": p_hash})

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the image: {e}"
        )
