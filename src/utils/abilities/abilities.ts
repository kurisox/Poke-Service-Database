import axios from "axios";
import log4js, { Logger } from "log4js";
import { IAbility } from "./IAbility";
import { IGeneration } from "../generations/IGeneration";
import { log } from "console";

const logger: Logger = log4js.getLogger("abilities.ts");
logger.level = "info";

logger.info("Starting abilities.ts");

async function fetchAbility(abilityID: number) {
  try {
    const fetchedAbility = await axios.get(
      `https://pokeapi.co/api/v2/ability/${abilityID}/`
    );
    const ability: IAbility = {
      id: fetchedAbility.data.id,
      name: fetchedAbility.data.name,
      names: fetchedAbility.data.names.map(
        (entry: { language: { name: string }; name: string }) => ({
          language: entry.language.name,
          name: entry.name,
        })
      ),
      generation: fetchedAbility.data.generation.name,
      effect:
        fetchedAbility.data.effect_entries.length > 0
          ? fetchedAbility.data.effect_entries.map(
              (entry: { effect: string; language: { name: string } }) => ({
                effect: entry.effect.replace(/[\n+`]/g, ""),
                language: entry.language.name,
              })
            )
          : [{ effect: "No effect", language: "unknown" }],
      flavour_text:
        fetchedAbility.data.flavor_text_entries.length > 0
          ? fetchedAbility.data.flavor_text_entries.map(
              (entry: { flavor_text: string; language: { name: string } }) => ({
                flavour_text: entry.flavor_text.replace(/[\n+`]/g, ""),
                language: entry.language.name,
              })
            )
          : [{ flavour_text: "No flavour text", language: "unknown" }],
      pokemon: fetchedAbility.data.pokemon.map(
        (entry: { pokemon: { name: string } }) => entry.pokemon.name
      ),
    };
    logger.info(`Sucessfully fetched ability with ID ${ability.id}`);
    return ability;
  } catch (error) {
    logger.error(`Error fetching ability with ID ${abilityID}: ${error}`);
    return null;
  }
}

function getLanguageID(languageArray: String[], language: String) {
  for (let i = 0; i < languageArray.length; i++) {
    if (language === languageArray[i]) {
      return i + 1;
    }
  }
}

export async function fetchAbilities() {
  var hasNext: boolean = true;
  var abilityID: number = 1;
  const abilities: IAbility[] = [];
  while (hasNext) {
    const ability = await fetchAbility(abilityID);
    if (ability !== null) {
      abilities.push(ability);
      logger.info(
        `Ability ${abilityID} - ${ability.name} successfully added to the array`
      );
      abilityID++;
    } else {
      logger.error(`Failed to add ability with ID ${abilityID} to the array`);
      break;
    }
  }
  logger.info(`Fetched ${abilities.length} abilities`);
  return abilities;
}

export function collectUniqueLanguages(ability: IAbility) {
  const languages = new Set<string>();
  const flavor_texts = ability.flavour_text;
  flavor_texts.forEach((language) => {
    languages.add(language.language);
  });
  return languages;
}

export function languagesSQLStatements(language: Set<string>) {
  const sqlStrings: Set<string> = new Set<string>();
  language.forEach((language) => {
    const insertLanguage = `
        INSERT INTO LANGUAGES (language)
        VALUES ('${language}');\n
        `;
    sqlStrings.add(insertLanguage);
    logger.info(`Language ${language} added to the SQL statements`);
  });
  return sqlStrings;
}

export function alternativeNamesSQLStatements(
  languages: string[],
  abilities: IAbility[]
) {
  const sqlStrings: Set<string> = new Set<string>();
  abilities.forEach((ability) => {
    ability.names.forEach((name) => {
      const insertName = `
            INSERT INTO ALTERNATIVE_ABILITY_NAMES (name, language_id, ability_id)
            VALUES ('${name.name}', ${getLanguageID(
        languages,
        name.language
      )}, '${ability.id}');\n
        `;
      sqlStrings.add(insertName);
      logger.info(`Alternative name ${name.name} added to the SQL statements`);
    });
  });
  return sqlStrings;
}

export function abilitiesSQLStatements(
  abilities: IAbility[],
  generations: IGeneration[]
) {
  const sqlStrings: Set<string> = new Set<string>();
  abilities.forEach((ability) => {
    var generation_id: number;
    generations.forEach((generation) => {
      if (generation.name === ability.generation) {
        generation_id = generation.id;
        const insertAbility = `
          INSERT INTO ABILITIES (id, name, generation_id)
          VALUES ('${ability.id}', '${ability.name}', '${generation_id}');\n
          `;
        sqlStrings.add(insertAbility);
        logger.info(`Ability ${ability.id} - ${ability.name} added to the SQL statements`);
      }
    });
  });
  return sqlStrings;
}

export function effectSQLStatements(
  abilities: IAbility[],
  languages: string[]
) {
  const sqlStrings: Set<string> = new Set<string>();
  abilities.forEach((ability) => {
    ability.effect.forEach((effect) => {
      const insertEffect = `
        INSERT INTO EFFECTS (effect, ability_id, language_id)
        VALUES ('${effect.effect}', ${ability.id}, ${getLanguageID(
        languages,
        effect.language
      )});\n
        `;
      sqlStrings.add(insertEffect);
      logger.info(`Effect ${effect.effect} added to the SQL statements`);
    });
  });
  return sqlStrings;
}

export function flavourTextSqlStatements(
  abilities: IAbility[],
  languages: string[]
) {
  const sqlStrings: Set<string> = new Set<string>();
  abilities.forEach((ability) => {
    ability.flavour_text.forEach((flavour_text) => {
      const insertFlavourText = `
        INSERT INTO FLAVOUR_TEXTS (flavour_text, ability_id, language_id)
        VALUES ('${flavour_text.flavour_text}', ${ability.id}, ${getLanguageID(
        languages,
        flavour_text.language
      )});\n
        `;
      sqlStrings.add(insertFlavourText);
      logger.info(`Flavour text ${flavour_text.flavour_text} added to the SQL statements`);
    });
  });
  return sqlStrings;
}
