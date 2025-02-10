import axios from "axios";
import log4js, { Logger } from "log4js";
import { IGeneration } from "./IGeneration";
import { log } from "console";

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
  const sqlStatements: Set<string> = new Set(); 
  generations.forEach((generation: IGeneration) => {
    sqlStatements.add(
      `INSERT INTO GENERATIONS (id, name) VALUES (${generation.id}, '${generation.name}');\n`
    );
    logger.info(`Added generation ${generation.name} to SQL statements`);
  });
  return sqlStatements;
}
