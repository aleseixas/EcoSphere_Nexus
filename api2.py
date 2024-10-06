from fastapi import FastAPI
from ecosystem import *


configFilePath = "config.json"
ecosystemsFilePath = "ecosystems.json"


app = FastAPI()
mappingBiomes = {
    'Florestas Temperadas': 0,
    'Florestas Tropicais': 1,
    'Desertos': 2,
    'Savanas': 3,
    'Pradarias': 4,
    'Oceanos': 5,
    'Manguezais': 6,
    'Recifes de Corais': 7,
    'Tundras': 8
}

ecosystemsNode = EcosystemsArray(ecosystemsFilePath)
world = World(configFilePath, ecosystemsNode)


@app.get('/')
def callSimulation(attributeToBeAltered, newValue, ecosystemName, numYears):
    global mappingBiomes
    global world
    global ecosystemsNode
    newValue = int(newValue)
    numYears = int(numYears)
    
    results = world.simulate(
        ecosystemName,
        attributeToBeAltered,
        newValue,
        numYears
    )
    
    return {
        key: value['dangerlevel'] for key, value in results.items()
    }


if __name__ == '__main__':
    print('Hello')