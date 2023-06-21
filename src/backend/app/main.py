from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def health_check():
    return {"message": "Server Up and Running"}, 200
