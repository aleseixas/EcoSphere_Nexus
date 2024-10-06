FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

ENV GEMINI_API_KEY="AIzaSyBCGRsPsci96nCLJ9_YlQn-Hr3QVuhlTtE"

COPY . .
EXPOSE 8080

CMD ["uvicorn", "api2:app", "--host", "0.0.0.0", "--port", "8080"]