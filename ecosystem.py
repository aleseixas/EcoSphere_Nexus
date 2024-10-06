import json
    
class EcoSystem:
    
    def __init__(
        self,
        name,
        temperature,
        umidity,
        biodiversity=1.0,  # Must be a value [0, 1]
        airQuality=1,
        waterQuality=1,
        deforestation=0
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
            raise ValueError("Biodiversity must be between 0 and 1.")

    def set_airQuality(self, airQuality):
        self._air = airQuality

    def set_waterQuality(self, waterQuality):
        self._water = waterQuality

    def set_deforestation(self, deforestation):
        self._deforestation = deforestation


class World:
    
    def __init__(self, configFilePath, ecosystemsNode):
        with open(configFilePath, 'rb') as f:
            self.worldConfig = json.loads(f)
            
        self.nodes = {
            node.get_name(): node for node in ecosystemsNode 
        }

    def simulateTemperature(self, delta, originNode, numYears):
        # temperature increases -> umidity decreases -> deforestation increases -> biodiversity decreases -> airQuality decreases -> waterQuality stays the same
        resultsSpace = []
        dangerLevel = 0 
        for _ in range(numYears):

            if delta >= 0.05:
                dangerLevel = 5
                
            elif delta < 0.05 and delta >= 0.03:
                dangerLevel = 4

            elif delta < 0.03 and delta >= 0.01:
                dangerLevel = 3

            elif delta < 0.01 and delta >= -0.02:
                dangerLevel = 3

            elif delta < -0.02 and delta >= -0.05:
                dangerLevel = 4

            else:
                dangerLevel = 5
            
            newUmidity = originNode.get_umidity() * (1-6*delta) / numYears
            newTemperature = originNode.get_temperature() * (1+delta)
            newDeforestation = originNode.get_deforestation() * (1+2*delta) / numYears
            newBiodiverstity = originNode.get_biodiversity() * (1-2*delta) / numYears
            newAirQuality = originNode.get_airQuality() * (1-2*delta) / numYears
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

            if delta <= -0.05:
                dangerLevel = 0
                
            elif delta > -0.05 and delta <= -0.03:
                dangerLevel = 0

            elif delta > -0.03 and delta <= -0.01:
                dangerLevel = 3

            elif delta > -0.01 and delta >= 0:
                dangerLevel = 3

            else:
                dangerLevel = 0
            
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

            if delta >= 0.05:
                dangerLevel = 5
                
            elif delta < 0.05 and delta >= 0.03:
                dangerLevel = 4

            elif delta < 0.03 and delta >= 0.01:
                dangerLevel = 3

            elif delta > 0:
                dangerLevel = 2

            else:
                dangerLevel = 0

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

            if delta <= -0.05:
                dangerLevel = 5
                
            elif delta > -0.05 and delta <= -0.03:
                dangerLevel = 4

            elif delta > -0.03 and delta <= -0.01:
                dangerLevel = 3

            elif delta > -0.01 and delta < 0:
                dangerLevel = 2

            else:
                dangerLevel = 0
            
            if dangerLevel > 0:

                newUmidity = originNode.get_umidity() * (1+delta) / numYears
                newTemperature = originNode.get_temperature() * (1-delta) / numYears
                newDeforestation = originNode.get_deforestation() * (1-4*delta) / numYears
                newBiodiverstity = originNode.get_biodiversity() * (1+5*delta) / numYears
                newAirQuality = originNode.get_airQuality() * (1+4*delta) / numYears
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

            if delta <= -0.01:
                dangerLevel = 5
                
            elif delta > -0.01 and delta <= -0.005:
                dangerLevel = 4

            else:
                dangerLevel = 3
            
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

            for n in self.nodes:
                
                ### Propagando através do mundo as mudanças

                if n.get_name() != ecosystemName:
                     
                    results[n.get_name()] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteração_Temperatura"][n.get_name()],
                        n,
                        numYears
                    )

                    
        elif attributeToBeUpdated == "umidity":
            attValue = node.get_umidity()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateUmidity(delta, node, numYears)

            for n in self.nodes:
                
                ### Propagando através do mundo as mudanças

                if n.get_name() != ecosystemName:
                     
                    results[n.get_name()] = self.simulateUmidity( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteração_Temperatura"][n.get_name()],
                        n,
                        numYears
                    )
                    
        elif attributeToBeUpdated == "biodiversity":
            attValue = node.get_biodiversity()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateBiodiversity(delta, node, numYears)

            for n in self.nodes:
                
                ### Propagando através do mundo as mudanças

                if n.get_name() != ecosystemName:
                     
                    results[n.get_name()] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteração_Qualidade_do_Ar"][n.get_name()],
                        n,
                        numYears
                    )
                    

        elif attributeToBeUpdated == "airQuality":
            attValue = node.get_airQuality()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateAirQuality(delta, node, numYears)

            for n in self.nodes:
                
                ### Propagando através do mundo as mudanças

                if n.get_name() != ecosystemName:
                     
                    results[n.get_name()] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteração_Qualidade_do_Ar"][n.get_name()],
                        n,
                        numYears
                        )
                    
        
        elif attributeToBeUpdated == "waterQuality":
            attValue = node.get_waterQuality()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateWaterQuality(delta, node, numYears)

            for n in self.nodes:
                
                ### Propagando através do mundo as mudanças

                if n.get_name() != ecosystemName:
                     
                    results[n.get_name()] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteração_Qualidade_da_Agua"][n.get_name()],
                        n,
                        numYears
                    )

        elif attributeToBeUpdated == "deforestation":
            attValue = node.get_deforestation()
            delta = (newValue - attValue) / attValue
            results[ecosystemName] = self.simulateDeforestation(delta, node, numYears)

            for n in self.nodes:
                
                ### Propagando através do mundo as mudanças

                if n.get_name() != ecosystemName:
                     
                    results[n.get_name()] = self.simulateTemperature( # valor que terá como chave o nome do ecossistema e os valores de alteração para cada dia
                        delta * self.worldConfig[ecosystemName]["OtherInformations"]["Weights"]["Alteração_Desmatamento"][n.get_name()],
                        n,
                        numYears
                    )
        
        return results