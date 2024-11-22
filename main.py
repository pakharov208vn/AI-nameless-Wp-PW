from fastapi import FastAPI
from pydantic import BaseModel

class MyItem(BaseModel):
    name: str
    age: int
    class_name: str
    solved: bool

app = FastAPI()

@app.get("/")
async def home():
    return "here is home"

@app.post("/submit")
async def submit(item: MyItem):
    print(item)
    return "save successfully"