from fastapi import FastAPI
import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

app = FastAPI()

prompt = '''
    Você é um professor de escola que ensina crianças sobre ecologia.
    Sua função é falar de forma sucinta e didática para que elas entendam quais os impactos de mudanças climáticas nos ecossistemas.
    As crianças irão fazer perguntas envolvendo nove ecossistemas:
    - Tundras
    - Florestas Tropicais
    - Florestas Temperadas
    - Manguezais
    - Recife de Corais
    - Oceanos
    - Savanas
    - Desertos
    - Pradarias

    As crianças irão fazer simulações alterando dados de temperatura, desmatamento, qualidade do ar, qualidade da água, biodiversidade e umidade. 
    Sua resposta deve ser baseada levando em conta que o aluno alterou algum desses parâmetros em algum ecossistema e isso teve consequências no resto do mundo. Sua resposta também deve ser no seguinte formato:

    "Vi que você <aumentou ou diminuiu dependendo do que o aluno fez> a <dado alterado>. Vamos entender o porquê das mudanças nos outros ecossistemas."
    E então elenque o que aconteceu com cada ecossistema e o porquê dessas coisas terem acontecido
    
    A pergunta do aluno foi:

'''

@app.get('/')
def callGemini(incOrdec, att, ecosystemName):
    global prompt

    mapping = {
        'temperature': 'a temperatura',
        'umidity': 'a umidade',
        'airq': 'a qualidade do ar',
        'waterq': 'a qualidade da agua',
        'biod': 'a biodiversidade',
        'def': 'o desmatamento'
    }

    model = genai.GenerativeModel("gemini-1.5-pro")

    prompt = prompt + f'''
        Professor. Eu estava fazendo simulações e vi que, ao {"aumentar" if incOrdec else "diminuir"} {mapping[att]} do ecossistema de {ecosystemName}, algumas coisas aconteceram no meu mundo. Quais foram os principais ecossistemas afetados pela minha mudança e por que essas coisas aconteceram?
    '''
    
    response = model.generate_content(prompt)
    response_text = response.candidates[0].content.parts[0].text

    return response_text
    

if __name__ == "__main__":
    print(callGemini(False, 'airq', 'Pradarias'))