interface ApiResponse {
    text: string
}

interface requestForGemini {
    incOrdec: boolean,
    att: string,
    ecosystemName: string
}

export default async function callGemini(increaseOrDecrease: boolean, attributeAltered: string, ecosystemName: string): Promise<ApiResponse> {
    const request: requestForGemini = {
        "incOrdec": increaseOrDecrease,
        "att": attributeAltered,
        "ecosystemName": ecosystemName
    };

    try {
        const response = await fetch (
          "https://apidocker-902862667412.us-central1.run.app", {
          method: 'GET', // Método GET por padrão
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request), // Envia o objeto request como JSON
        });
    
    
        const data: ApiResponse = await response.json();
        return data;
    
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }

}