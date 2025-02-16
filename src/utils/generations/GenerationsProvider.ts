import axios from "axios";
import log4js, { Logger } from "log4js";
import GenerationData from "./GenerationData";
import IDataServer from "../interfaces/IDataServer";

export default class GenerationsProvider
  implements IDataServer<GenerationData>
{
  private logger: Logger;
  private generationArray: GenerationData[];

  constructor() {
    this.logger = log4js.getLogger("GenerationProvider.ts");
    this.logger.level = "info";
    this.generationArray = [];
  }

  getData(): GenerationData[] {
    return this.generationArray;
  }

  public async fetchAllData() {
    try {
      const generationData = await axios.get(
        "https://pokeapi.co/api/v2/generation/"
      );
      this.logger.info("Sucessfully fetched generation data");
      this.extractData(generationData.data.results);
    } catch (error) {
      this.logger.error(`Error fetching generation data: ${error}`);
    }
  }

  public extractData(data: any): void {
    let counter = 1;
    data.forEach((element: { name: string }) => {
      this.logger.info(
        `Extracting data for generation ${counter}-${element.name}`
      );
      const generation: GenerationData = GenerationData.Builder.setId(counter)
        .setName(element.name)
        .build();
      this.generationArray.push(generation);
      counter++;
      this.logger.info(
        `Data for generation ${generation.ID}-${generation.Name} sucessfully extracted and pushed to the array`
      );
    });
  }

  createSQLStatements(data: GenerationData[]): string[] {
    const sqlStatements: string[] = [];
    data.forEach((generation) => {
      const sqlStatement: string = `INSERT INTO GENERATIONS (id, name) VALUES (${generation.ID}, '${generation.Name}');\n`;
      sqlStatements.push(sqlStatement);
      this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
    });
    return sqlStatements;
  }
}
