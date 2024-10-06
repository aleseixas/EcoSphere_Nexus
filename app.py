import google.generativeai as genai
import os

# Configure a chave de API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
# Enviar o prompt para o modelo
model = genai.GenerativeModel("gemini-1.5-pro")
response = model.generate_content(
    "Me apresente vc mesmo"
)

# Exibir a resposta
print(response)
