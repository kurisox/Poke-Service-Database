import axios from "axios";
import log4js, { Logger } from "log4js";
import { IGeneration } from "./IGeneration";

const logger: Logger = log4js.getLogger("generations.ts");
logger.level = "info";

logger.info("Starting generations.ts");

export async function fetchGenerations() {
  const generationsDetails: IGeneration[] = [];
  try {
    const generations = await axios.get(
      `https://pokeapi.co/api/v2/generation/`
    );
    var counter: number = 1;
    generations.data.results.forEach((result: { name: any; }) => {
      generationsDetails.push({
        id: counter,
        name: result.name,
      });
      logger.info(`Sucessfully fetched generation ${counter}`);
      counter++;
    });
  } catch (error) {
    logger.error(`Error fetching generations: ${error}`);
  }
  return generationsDetails;
}

export function generationSQLStatements(generations: IGeneration[]) {
  const sqlStatements: string[] = [];
  generations.forEach((generation: IGeneration) => {
    sqlStatements.push(
      `INSERT INTO generations (id, name) VALUES (${generation.id}, '${generation.name}');\n`
    );
  });
  return sqlStatements;
}
