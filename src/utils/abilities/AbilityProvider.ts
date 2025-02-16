import axios from "axios";
import log4js, { Logger } from "log4js";
import IDataServer from "../interfaces/IDataServer";
import AbilityData from "./AbilityData";
import GenerationData from "../generations/GenerationData";
import LanguageData from "../languages/LanguageData";

export default class AbilityProvider implements IDataServer<AbilityData> {
  private logger: Logger;
  private abilityArray: AbilityData[];
  private generations: GenerationData[] | undefined;
  private languages: LanguageData[] | undefined;
  private ID: number;

  constructor() {
    this.logger = log4js.getLogger("AbilityProvider.ts");
    this.logger.level = "info";
    this.abilityArray = [];
    this.ID = 1;
  }

  setData(data: any[]): void {
    this.generations = data[0];
    this.languages = data[1];
  }

  getData(): AbilityData[] {
    return this.abilityArray;
  }

  public async fetchAllData() {
    let hasNext = true;
    do {
      try {
        const typeData = await axios.get(
          `https://pokeapi.co/api/v2/ability/${this.ID}/`
        );
        this.extractData(typeData.data);
        this.ID++;
      } catch (error) {
        this.logger.error(
          `Error fetching ability with ID ${this.ID}: ${error}`
        );
        hasNext = false;
      }
    } while (hasNext);
  }

  public extractData(data: any): void {
    this.logger.info(`Extracting data for ability ${this.ID}-${data.name}`);
    const ability: AbilityData = AbilityData.Builder.setId(this.ID)
      .setName(data.name)
      .setGeneration(data.generation.name)
      .setEffect(
        data.effect_entries.length > 0
          ? data.effect_entries.map(
              (entry: { effect: string; language: { name: string } }) => ({
                effect: entry.effect.replace(/[\n+`]/g, ""),
                language: entry.language.name,
              })
            )
          : [{ effect: "No effect", language: "unknown" }]
      )
      .setFlavorText(
        data.flavor_text_entries.length > 0
          ? data.flavor_text_entries.map(
              (entry: { flavor_text: string; language: { name: string } }) => ({
                flavour_text: entry.flavor_text.replace(/[\n+`]/g, ""),
                language: entry.language.name,
              })
            )
          : [{ flavour_text: "No flavour text", language: "unknown" }]
      )
      .setPokemonName(
        data.pokemon.map(
          (entry: { pokemon: { name: string } }) => entry.pokemon.name
        )
      )
      .build();
    this.abilityArray.push(ability);
  }

  public createSQLStatements(data: AbilityData[]): string[] {
    const sqlStatements: string[] = [];
    sqlStatements.push(...this.createAbilitySQLStatements(data));
    sqlStatements.push(
      ...this.createEffectSQLStatements(data, this.languageMap())
    );
    sqlStatements.push(
      ...this.createFlavourTextSQLStatements(data, this.languageMap())
    );
    return sqlStatements;
  }

  private createAbilitySQLStatements(data: AbilityData[]): string[] {
    const sqlStatements: string[] = [];
    const generationMap = this.generationMap();
    data.forEach((ability) => {
      if (generationMap.has(ability.Generation)) {
        const sqlStatement: string = `INSERT INTO ABILITIES (id, name, generation_id) VALUES (${
          ability.ID
        }, '${ability.Name}', ${generationMap.get(ability.Generation)});\n`;
        sqlStatements.push(sqlStatement);
        this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
      }
    });
    return sqlStatements;
  }

  private createEffectSQLStatements(
    data: AbilityData[],
    languagemap: Map<string, number>
  ): string[] {
    const sqlStatements: string[] = [];
    data.forEach((ability) => {
      ability.Effect.forEach((effect) => {
        if (languagemap.has(effect.language)) {
          const sqlStatement: string = `INSERT INTO ABILITY_EFFECTS (effect, ability_id, language_id) VALUES ('${effect.effect.replace(
            /'/g,
            "''"
          )}}', ${ability.ID}, ${languagemap.get(effect.language)});\n`;
          sqlStatements.push(sqlStatement);
          this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
        }
      });
    });
    return sqlStatements;
  }

  private createFlavourTextSQLStatements(
    data: AbilityData[],
    languagemap: Map<string, number>
  ): string[] {
    const sqlStatements: string[] = [];
    data.forEach((ability) => {
      ability.FlavorText.forEach((flavorText) => {
        if (languagemap.has(flavorText.language)) {
          const sqlStatement: string = `INSERT INTO ABILITY_FLAVOUR_TEXTS (flavour_text, ability_id, language_id) VALUES ('${flavorText.flavour_text.replace(
            /'/g,
            "''"
          )}', ${ability.ID}, ${languagemap.get(flavorText.language)});\n`;
          sqlStatements.push(sqlStatement);
          this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
        }
      });
    });
    return sqlStatements;
  }

  private generationMap(): Map<string, number> {
    const map = new Map<string, number>();
    this.generations?.forEach((generation) => {
      map.set(generation.Name, generation.ID);
    });
    return map;
  }

  private languageMap(): Map<string, number> {
    const map = new Map<string, number>();
    this.languages?.forEach((language) => {
      map.set(language.Name, language.ID);
    });
    return map;
  }
}
