import json
configFilePath = "config.json"
ecosystemsFilePath = "ecosystems.json"
    
class EcoSystem:
    
    def __init__(
        self,
        name,
        temperature,
        umidity,
        biodiversity,  # Must be a value [0, 1]
        airQuality,
        waterQuality,
        deforestation,
    ):
        self._name = name
        self._temp = temperature
        self._um = umidity
        self._bio = biodiversity
        self._air = airQuality
        self._water = waterQuality
        self._deforestation = deforestation

    # Getters

    def get_name(self):
        return self._name
    
    def get_temperature(self):
        return self._temp

    def get_umidity(self):
        return self._um

    def get_biodiversity(self):
        return self._bio

    def get_airQuality(self):
        return self._air

    def get_waterQuality(self):
        return self._water

    def get_deforestation(self):
        return self._deforestation

    # Setters
    def set_temperature(self, temperature):
        self._temp = temperature

    def set_umidity(self, umidity):
        self._um = umidity

    def set_biodiversity(self, biodiversity):
        if 0.0 <= biodiversity <= 1.0:
            self._bio = biodiversity
        else:
            #raise ValueError("Biodiversity must be between 0 and 1.")
            self._bio = 1e-18

    def set_airQuality(self, airQuality):
        self._air = airQuality

    def set_waterQuality(self, waterQuality):
        self._water = waterQuality

    def set_deforestation(self, deforestation):
        self._deforestation = deforestation

def EcosystemsArray(ecosystemsFilePath):
    l = []
    with open(ecosystemsFilePath, 'rb') as f:
        ecosystems = json.load(f)
        for x in range(len(ecosystems)):
            new_ecosystem = EcoSystem(ecosystems[x]["name"], 
                                      ecosystems[x]["temperature"], 
                                      ecosystems[x]["umidity"], 
                                      ecosystems[x]["biodiversity"], 
                                      ecosystems[x]["airQuality"], 
                                      ecosystems[x]["waterQuality"], 
                                      ecosystems[x]["deforestation"])
            l.append(new_ecosystem)
    return l


class World:
    def __init__(self, configFilePath, ecosystemsNode):
        with open(configFilePath, 'rb') as f:
            self.worldConfig = json.load(f)
            
        self.nodes = {
            node.get_name(): node for node in ecosystemsNode 
        }

    def simulateTemperature(self, delta, originNode, numYears):
        # temperature increases -> umidity decreases -> deforestation increases -> biodiversity decreases -> airQuality decreases -> waterQuality stays the same
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if abs(delta) >= 0.6:
                dangerLevel = 5
                
            elif abs(delta) < 0.6 and delta >= 0.48:
                dangerLevel = 4

            elif abs(delta) < 0.36 and delta >= 0.24:
                dangerLevel = 3

            elif abs(delta) < 0.24 and delta >= 0.12:
                dangerLevel = 2
            else:
                dangerLevel = 1
            
            delta /= 30
            newUmidity = originNode.get_umidity() * (1-6*delta/numYears)
            newTemperature = originNode.get_temperature() * (1+delta/numYears)
            newDeforestation = originNode.get_deforestation() * (1+2*delta/numYears)
            newBiodiverstity = originNode.get_biodiversity() * (1-2*delta/numYears)
            newAirQuality = originNode.get_airQuality() * (1-2*delta/numYears)
            newWaterQuality = originNode.get_waterQuality()

            originNode.set_umidity(newUmidity)
            originNode.set_temperature(newTemperature)
            originNode.set_deforestation(newDeforestation)
            originNode.set_biodiversity(newBiodiverstity)
            originNode.set_airQuality(newAirQuality)
            originNode.set_waterQuality(newWaterQuality)

            resultsSpace.append(
                {
                    "temp": newTemperature,
                    "def": newDeforestation,
                    "bio": newBiodiverstity, #each index in resultsSpace will be a day
                    "airQ": newAirQuality,
                    "u": newUmidity,
                    "waterQ": newWaterQuality
                }
            )

            return {
                "simulation": resultsSpace,
                "dangerlevel": dangerLevel
            }
        
    def simulateUmidity(self, delta, originNode, numYears):
        # umidity increases -> temperature increases -> deforestation depends -> biodiversity depends -> airQuality increases -> waterQuality stays the same
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if delta >= 0.15:
                dangerLevel = 5    
                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1+dangerLevel*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1-delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1-2*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1+0.75*delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)

            elif delta < 0.15 and delta >= 0.07:
                dangerLevel = 3
                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1+dangerLevel*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1-delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1-delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1+0.5*delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)

            elif delta < 0.07 and delta >= -0.07:
                dangerLevel = 0
                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1+0.1*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1+0.1*delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1-0.1*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1-0.05*delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)
                
            elif delta < -0.07 and delta >= -0.15:
                dangerLevel = 3
                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1-1.5*dangerLevel*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1+2*delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1-2*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1-2*delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)
                
            else:
                dangerLevel = 5
            
                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1-3*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1+3*delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1-1.5*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1-2*delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)

            if abs(delta) >= 0.8:
                dangerLevel = 5
                
            elif abs(delta) < 0.8 and delta >= 0.6:
                dangerLevel = 4

            elif abs(delta) < 0.6 and delta >= 0.4:
                dangerLevel = 3

            elif abs(delta) < 0.4 and delta >= 0.2:
                dangerLevel = 2
            else:
                dangerLevel = 1
                
            resultsSpace.append(
                {
                    "temp": newTemperature,
                    "def": newDeforestation,
                    "bio": newBiodiverstity,
                    "airQ": newAirQuality,
                    "u": newUmidity,
                    "waterQ": originNode.get_waterQuality()
                }
            )

            return {
                "simulation": resultsSpace,
                "dangerlevel": dangerLevel
            }
        
    def simulateAirQuality(self, delta, originNode, numYears):
        # AirQuality decreases -> umidity decreases -> temperature increases -> deforestation increases -> biodiversity decreases -> waterQuality decreases
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if abs(delta) >= 0.8:
                dangerLevel = 5
                
            elif abs(delta) < 0.8 and delta >= 0.6:
                dangerLevel = 4

            elif abs(delta) < 0.6 and delta >= 0.4:
                dangerLevel = 3

            elif abs(delta) < 0.4 and delta >= 0.2:
                dangerLevel = 2
            else:
                dangerLevel = 1
            
            if dangerLevel > 0:
                newUmidity = originNode.get_umidity() * (1+3*delta) / numYears
                newTemperature = originNode.get_temperature() * (1-1.5*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1-3*delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1+4*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1+delta) / numYears
                newWaterQuality = originNode.get_waterQuality() * (1+delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)
                originNode.set_waterQuality(newWaterQuality)

                resultsSpace.append(
                    {
                        "temp": newTemperature,
                        "def": newDeforestation,
                        "bio": newBiodiverstity,
                        "airQ": newAirQuality,
                        "u": newUmidity,
                        "waterQ": newWaterQuality
                    }
                )

            return {
                "simulation": resultsSpace,
                "dangerlevel": dangerLevel
            }
        
    def simulateDeforestation(self, delta, originNode, numYears):
        # deforestation increases -> umidity decreases -> temperature increases -> biodiversity decreases -> airQuality decreases -> waterQuality decreases
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if abs(delta) >= 0.8:
                dangerLevel = 5
                
            elif abs(delta) < 0.8 and delta >= 0.6:
                dangerLevel = 4

            elif abs(delta) < 0.6 and delta >= 0.4:
                dangerLevel = 3

            elif abs(delta) < 0.4 and delta >= 0.2:
                dangerLevel = 2
            else:
                dangerLevel = 1

            if dangerLevel > 0:
                newUmidity = originNode.get_umidity() * (1-3*delta) / numYears
                newTemperature = originNode.get_temperature() * (1+3*delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1+delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1-5*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1-5*delta) / numYears
                newWaterQuality = originNode.get_waterQuality() * (1-4*delta) / numYears

                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)
                originNode.set_waterQuality(newWaterQuality)

                resultsSpace.append(
                    {
                        "temp": newTemperature,
                        "def": newDeforestation,
                        "bio": newBiodiverstity,
                        "airQ": newAirQuality,
                        "u": newUmidity,
                        "waterQ": newWaterQuality
                    }
                )

            return {
                "simulation": resultsSpace,
                "dangerlevel": dangerLevel
            }
        
    def simulateWaterQuality(self, delta, originNode, numYears):
        # water quality decreases -> umidity decreases -> deforestation increases -> biodiversity decreases -> airQuality decreases -> temperature increases
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if abs(delta) >= 0.9:
                dangerLevel = 5
                
            elif abs(delta) < 0.9 and delta >= 0.7:
                dangerLevel = 4

            elif abs(delta) < 0.7 and delta >= 0.4:
                dangerLevel = 3

            elif abs(delta) < 0.4 and delta >= 0.2:
                dangerLevel = 2
            else:
                dangerLevel = 1
            
            if dangerLevel > 0:
                delta = delta*2
                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1-delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1-delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1+3*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1+delta) / numYears
                newWaterQuality = originNode.get_waterQuality() * (1+delta) / numYears
                
                originNode.set_umidity(newUmidity)
                originNode.set_temperature(newTemperature)
                originNode.set_deforestation(newDeforestation)
                originNode.set_biodiversity(newBiodiverstity)
                originNode.set_airQuality(newAirQuality)
                originNode.set_waterQuality(newWaterQuality)

                resultsSpace.append(
                    {
                        "temp": newTemperature,
                        "def": newDeforestation,
                        "bio": newBiodiverstity,
                        "airQ": newAirQuality,
                        "u": newUmidity,
                        "waterQ": newWaterQuality
                    }
                )

            return {
                "simulation": resultsSpace,
                "dangerlevel": dangerLevel
            }
        
    def simulateBiodiversity(self, delta, originNode, numYears):
        # biodiversity decreases -> umidity decreases -> deforestation increases -> temperature increases -> airQuality decreases -> waterQuality decreases
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if abs(delta) >= 0.7:
                dangerLevel = 5
                
            elif abs(delta) < 0.7 and delta >= 0.5:
                dangerLevel = 4

            elif abs(delta) < 0.5 and delta >= 0.4:
                dangerLevel = 3

            elif abs(delta) < 0.4 and delta >= 0.1:
                dangerLevel = 2
            else:
                dangerLevel = 1
            
            newUmidity = originNode.get_umidity() * (1+6*delta) / numYears
            newTemperature = originNode.get_temperature() * (1-5*delta)
            newDeforestation = originNode.get_deforestation() * (1-10*delta) / numYears
            newBiodiverstity = originNode.get_biodiversity() * (1+delta) / numYears
            newAirQuality = originNode.get_airQuality() * (1+8*delta) / numYears
            newWaterQuality = originNode.get_waterQuality() * (1 + 6*delta) / numYears

            originNode.set_umidity(newUmidity)
            originNode.set_temperature(newTemperature)
            originNode.set_deforestation(newDeforestation)
            originNode.set_biodiversity(newBiodiverstity)
            originNode.set_airQuality(newAirQuality)
            originNode.set_waterQuality(newWaterQuality)

            resultsSpace.append(
                {
                    "temp": newTemperature,
                    "def": newDeforestation,
                    "bio": newBiodiverstity,
                    "airQ": newAirQuality,
                    "u": newUmidity,
                    "waterQ": newWaterQuality
                }
            )

            return {
                "simulation": resultsSpace,
                "dangerlevel": dangerLevel
            }
        

    def simulate(self, ecosystemName, attributeToBeUpdated, newValue, numYears):
        
        results = {}
        node = self.nodes[ecosystemName]
        
        if attributeToBeUpdated == "temperature":
            attValue = node.get_temperature()
            delta = (newValue - attValue) / attValue # calc variation
            results[ecosystemName] = self.simulateTemperature(delta, node, numYears)

            for n_name, n_node in self.nodes.items():
                
                ### Propagando através do mundo as mudanças

                if n_name != ecosystemName:
                     
                    results[n_node.get_name()] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteracao_Temperatura"][n_node.get_name()],
                        n_node,
                        numYears
                    )

                    
        elif attributeToBeUpdated == "umidity":
            attValue = node.get_umidity()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateUmidity(delta, node, numYears)

            for n_name, n_node in self.nodes.items():
                
                ### Propagando através do mundo as mudanças

                if n_name != ecosystemName:
                     
                    results[n_name] = self.simulateUmidity( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteracao_Temperatura"][n_name],
                        n_node,
                        numYears
                    )
                    
        elif attributeToBeUpdated == "biodiversity":
            attValue = node.get_biodiversity()
            delta = (newValue - attValue) / newValue
            results[ecosystemName] = self.simulateBiodiversity(delta, node, numYears)

            for n_name, n_node in self.nodes.items():
                
                ### Propagando através do mundo as mudanças

                if n_name != ecosystemName:
                     
                    results[n_name] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteracao_Qualidade_do_Ar"][n_name],
                        n_node,
                        numYears
                    )
                    

        elif attributeToBeUpdated == "airQuality":
            attValue = node.get_airQuality()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateAirQuality(delta, node, numYears)

            for n_name, n_node in self.nodes.items():
                
                ### Propagando através do mundo as mudanças

                if n_name != ecosystemName:
                     
                    results[n_name] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteracao_Qualidade_do_Ar"][n_name],
                        n_node,
                        numYears
                        )
                    
        
        elif attributeToBeUpdated == "waterQuality":
            attValue = node.get_waterQuality()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateWaterQuality(delta, node, numYears)

            for n_name, n_node in self.nodes.items():
                
                ### Propagando através do mundo as mudanças

                if n_name != ecosystemName:
                     
                    results[n_name] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteracao_Qualidade_da_Agua"][n_name],
                        n_node,
                        numYears
                    )

        elif attributeToBeUpdated == "deforestation":
            attValue = node.get_deforestation()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateDeforestation(delta, node, numYears)

            for n_name, n_node in self.nodes.items():
                
                ### Propagando através do mundo as mudanças

                if n_name != ecosystemName:
                     
                    results[n_name] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteracao_Desmatamento"][n_name],
                        n_node,
                        numYears
                    )
        
        return results
    

### Testing section ###
ecosystemsNode = EcosystemsArray(ecosystemsFilePath)
world = World(configFilePath, ecosystemsNode)
#results = world.simulate(ecosystemsNode[0].get_name(),"temperature", 30, 10)
#print(world.simulate(ecosystemsNode[0].get_name(),"umidity", 0.4, 10))
results = world.simulate(ecosystemsNode[0].get_name(),"biodiversity", 0.4, 10)
world.simulate(ecosystemsNode[0].get_name(),"airQuality", 0.1, 10)
world.simulate(ecosystemsNode[0].get_name(),"waterQuality", 0.3, 10)
world.simulate(ecosystemsNode[0].get_name(),"deforestation", 0.1, 10)

for key, value in results.items():
    print(value["dangerlevel"])



