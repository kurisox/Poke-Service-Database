import { IAbility } from "../src/utils/abilities/IAbility.ts";
import {
  fetchAbilities,
  collectUniqueLanguages,
  languagesSQLStatements,
  alternativeNamesSQLStatements,
  abilitiesSQLStatements,
  effectSQLStatements,
  flavourTextSqlStatements,
} from "../src/utils/abilities/abilities.ts";
import { IGeneration } from "../src/utils/generations/IGeneration.ts";
import {
  fetchGenerations,
  generationSQLStatements,
} from "../src/utils/generations/generations.ts";
import { IType } from "../src/utils/types/IType.ts";
import {
  fetchTypes,
  typesSQLStatements,
  damageRelationsSQLStatements,
} from "../src/utils/types/types.ts";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import log4js, { Logger } from "log4js";

//logger setup
const logger: Logger = log4js.getLogger("init.ts");
logger.level = "info";

// Get the current directory and file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initSqlPath = path.join(__dirname, "init.sql");

//prepares data for the init.sql script
async function prepareData() {
  try {
    const abilities: IAbility[] = await fetchingData(
      "abilities",
      fetchAbilities
    );
    logger.info("Extracting unique languages from abilities");
    const languages: Set<string> = collectUniqueLanguages(abilities[0]);
    logger.info("Unique Languages extracted");
    const generations: IGeneration[] = await fetchingData(
      "generations",
      fetchGenerations
    );
    const types: Set<IType> = await fetchingData("types", fetchTypes);
    createSQLStatements(abilities, languages, generations, types);
  } catch (error) {
    logger.error(`Error preparing data: ${error}`);
  }
}

async function fetchingData<T>(
  name: string,
  fetchFunction: () => Promise<T>
): Promise<T> {
  logger.info(`Fetching ${name}`);
  const result = await fetchFunction();
  logger.info(`${name} fetched`);
  return result;
}

//creates the sql statements for the init.sql script
function createSQLStatements(
  abilities: IAbility[],
  languages: Set<string>,
  generations: IGeneration[],
  types: Set<IType>
) {
  const statementArray: Set<string> = new Set();
  const languagesArray: string[] = Array.from(languages);
  addStatements(statementArray, "language", () =>
    languagesSQLStatements(languages)
  );
  addStatements(statementArray, "generation", () =>
    generationSQLStatements(generations)
  );
  addStatements(statementArray, "abilities", () =>
    abilitiesSQLStatements(abilities, generations)
  );
  addStatements(statementArray, "alternative names", () =>
    alternativeNamesSQLStatements(languagesArray, abilities)
  );
  addStatements(statementArray, "effect", () =>
    effectSQLStatements(abilities, languagesArray)
  );
  addStatements(statementArray, "flavour text", () =>
    flavourTextSqlStatements(abilities, languagesArray)
  );
  addStatements(statementArray, "types", () => typesSQLStatements(types));
  addStatements(statementArray, "types damage relation", () =>
    damageRelationsSQLStatements(types)
  );
  populateSQLScript(statementArray);
}

function addStatements(
  statementsArray: Set<string>,
  name: string,
  getStatement: () => Set<string>
) {
  logger.info(`Creating ${name} statements`);
  const statements: Set<string> = getStatement();
  statements.forEach((statement: string) => statementsArray.add(statement));
  logger.info(`${name} statements created`);
}

//populates the init.sql script with the statements
function populateSQLScript(statementsArray: Set<string>) {
  logger.info("Populating init.sql with statements");
  statementsArray.forEach((statement: string) => {
    fs.appendFileSync(initSqlPath, statement);
  });
  logger.info("init.sql populated with statements");
}

//start the script
function main() {
  logger.info("Starting init.ts");
  prepareData();
}
main();
