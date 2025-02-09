import {
    fetchAbilities,
    collectUniqueLanguages,
    languagesSQLStatements,
    alternativeNamesSQLStatements,
    abilitiesSQLStatements
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
  
  const logger: Logger = log4js.getLogger("init.ts");
  logger.level = "info";
  // Get the current directory and file path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const initSqlPath = path.join(__dirname, "init.sql");
  
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
  
  function createSQLStatements(abilities: IAbility[], languages: Set<string>, generations: IGeneration[]) {
    const statementArray: string[] = [];
    logger.info("Creating language sql statements");
    const languageStatements: string[] = languagesSQLStatements(languages);
    statementArray.push(...languageStatements);
    logger.info("Language sql statements created");
    logger.info("Creating alternative names statements");
    const alternativeNamesStatements: string[] = alternativeNamesSQLStatements(
      languages,
      abilities
    );
    statementArray.push(...alternativeNamesStatements);
    logger.info("Alternative names statements created");
    const generationStatements: string[] = generationSQLStatements(generations);
    statementArray.push(...generationStatements);
    const abilitiesStatements: string[] = abilitiesSQLStatements(abilities, generations);
    statementArray.push(...abilitiesStatements);
    populateSQLScript(statementArray);
  }
  
  function populateSQLScript(statementArray: string[]) {
    logger.info("Populating init.sql with statements");
    statementArray.forEach((statement: string) => {
      fs.appendFileSync(initSqlPath, statement);
    });
    logger.info("init.sql populated with statements");
  
  }
  
  logger.info("Starting init.ts");
  prepareData();
  