import {
    fetchAbilities,
    collectUniqueLanguages,
    languagesSQLStatements,
    alternativeNamesSQLStatements,
    abilitiesSQLStatements,
    effectSQLStatements,
    flavourTextSqlStatements
  } from "../src/utils/abilities/abilities.ts";
  import { IAbility } from "../src/utils/abilities/IAbility.ts";
  import {
    fetchGenerations,
    generationSQLStatements,
  } from "../src/utils/generations/generations.ts";
  import fs from "fs";
  import { fileURLToPath } from "url";
  import path from "path";
  import log4js, { Logger } from "log4js";
  import { IGeneration } from "../src/utils/generations/IGeneration.ts";
  
  //logger setup
  const logger: Logger = log4js.getLogger("init.ts");
  logger.level = "info";

  // Get the current directory and file path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const initSqlPath = path.join(__dirname, "init.sql");
  
  //prepares data for the init.sql script
  async function prepareData() {
    logger.info("Fetching abilities");
    const abilities: IAbility[] = await fetchAbilities();
    logger.info("Abilities fetched");
    logger.info("Extracting unique languages from abilities");
    const uniqueLanguages: Set<string> = collectUniqueLanguages(abilities[0]);
    logger.info("Unique Languages extracted");
    logger.info("Fetching generations");
    const generations: IGeneration[] = await fetchGenerations();
    logger.info("Generations fetched");
    createSQLStatements(abilities, uniqueLanguages, generations);
  }
  
  //creates the sql statements for the init.sql script
  function createSQLStatements(abilities: IAbility[], languages: Set<string>, generations: IGeneration[]) {
    const statementArray: Set<string> = new Set();
    const languagesArray: string[] = Array.from(languages);
    logger.info("Creating language sql statements");
    const languageStatements: Set<string> = languagesSQLStatements(languages);
    addStatements(statementArray, languageStatements);
    logger.info("Language sql statements created");
    logger.info("Creating alternative names statements");
    const alternativeNamesStatements: Set<string> = alternativeNamesSQLStatements(
      languagesArray,
      abilities
    );
    addStatements(statementArray, alternativeNamesStatements);
    logger.info("Alternative names statements created");
    const generationStatements: Set<string> = generationSQLStatements(generations);
    addStatements(statementArray, generationStatements);
    logger.info("Creating abilities statements");
    const abilitiesStatements: Set<string> = abilitiesSQLStatements(abilities, generations);
    addStatements(statementArray, abilitiesStatements);
    logger.info("Abilities statements created");
    logger.info("Creating effect statements");
    const effectStatements: Set<string> = effectSQLStatements(abilities, languagesArray);
    addStatements(statementArray, effectStatements);
    logger.info("Effect statements created");
    logger.info("Creating flavour text statements");
    const flavourTextStatements: Set<string> = flavourTextSqlStatements(abilities, languagesArray);
    addStatements(statementArray, flavourTextStatements);
    logger.info("Flavour text statements created");
    populateSQLScript(statementArray);
  }

  function addStatements(statementsArray: Set<string>, statements: Set<string> ) {
    statements.forEach((statement: string) => statementsArray.add(statement));
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