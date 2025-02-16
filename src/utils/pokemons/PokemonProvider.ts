import axios from "axios";
import log4js, { Logger } from "log4js";
import IDataServer from "../interfaces/IDataServer";
import PokemonData from "./PokemonData";
import AbilityData from "../abilities/AbilityData";
import TypeData from "../types/TypeData";

export default class PokemonProvider implements IDataServer<PokemonData> {
  private logger: Logger;
  private pokemonArray: PokemonData[];
  private abilities?: AbilityData[];
  private types?: TypeData[];
  private ID: number;

  constructor() {
    this.logger = log4js.getLogger("PokemonProvider.ts");
    this.logger.level = "info";
    this.pokemonArray = [];
    this.ID = 1;
  }

  setData(data: any[]): void {
    this.abilities = data[0];
    this.types = data[1];
  }

  getData(): PokemonData[] {
    return this.pokemonArray;
  }

  public async fetchAllData() {
    let hasNext = true;
    do {
      try {
        const pokemonData = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${this.ID}/`
        );
        this.extractData(pokemonData.data);
        this.ID++;
      } catch (error) {
        this.logger.error(
          `Error fetching pokemon with ID ${this.ID}: ${error}`
        );
        hasNext = false;
      }
    } while (hasNext);
  }

  public extractData(data: any): void {
    this.logger.info(`Extracting data for pokemon ${this.ID}-${data.name}`);
    const sprites = [
      {
        name: "front_default",
        url: data.sprites.other["official-artwork"].front_default,
      },
      {
        name: "front_shiny",
        url: data.sprites.other["official-artwork"].front_shiny,
      },
    ];
    const pokemon: PokemonData = PokemonData.Builder.setId(this.ID)
      .setName(data.name)
      .setHeight(data.height)
      .setWeight(data.weight)
      .setAbilities(data.abilities.map((ability: any) => ability.ability.name))
      .setTypes(data.types.map((type: any) => type.type.name))
      .setSprites(sprites)
      .build();
    this.pokemonArray.push(pokemon);
  }

  createSQLStatements(data: PokemonData[]): string[] {
    const sqlStatements: string[] = [];
    sqlStatements.push(...this.createPokemonSQLStatement(data));
    sqlStatements.push(...this.createAbilitySQLStatement(data));
    sqlStatements.push(...this.createSpritesSQLStatement(data));
    sqlStatements.push(...this.createTypeSQLStatement(data));
    return sqlStatements;
  }

  private createPokemonSQLStatement(data: PokemonData[]): string[] {
    const sqlStatements: string[] = [];
    data.forEach((pokemon) => {
      const sql = `INSERT INTO POKEMONS (id, name, height, weight) VALUES (${pokemon.ID}, '${pokemon.Name}', ${pokemon.Height}, ${pokemon.Weight});\n`;
      sqlStatements.push(sql);
      this.logger.info(`SQL statement: ${sql} added to the list`);
    });
    return sqlStatements;
  }

  private createAbilitySQLStatement(data: PokemonData[]): string[] {
    const sqlStatements: string[] = [];
    const abilityMap = this.abiblityMap();
    data.forEach((pokemon) => {
      pokemon.Abilities.forEach((ability) => {
        const sql = `INSERT INTO POKEMON_ABILITIES (pokemon_id, ability_id) VALUES (${
          pokemon.ID
        }, ${abilityMap.get(ability)});\n`;
        sqlStatements.push(sql);
        this.logger.info(`SQL statement: ${sql} added to the list`);
      });
    });
    return sqlStatements;
  }


  private createSpritesSQLStatement(data: PokemonData[]): string[] {
    const sqlStatements: string[] = [];
    data.forEach((pokemon) => {
      pokemon.Sprites.forEach((sprite) => {
        const sql = `INSERT INTO POKEMON_SPRITES (name, url pokemon_id) VALUES ($'{sprite.name}', '${sprite.url}', ${pokemon.ID});\n`;
        sqlStatements.push(sql);
      });
    });
    return sqlStatements;
  }

  private createTypeSQLStatement(data: PokemonData[]): string[] {
    const sqlStatements: string[] = [];
    const typeMap = this.typeMap();
    data.forEach((pokemon) => {
      pokemon.Types.forEach((type) => {
        const sql = `INSERT INTO POKEMON_TYPES (pokemon_id, type_id) VALUES (${
          pokemon.ID
        }, ${typeMap.get(type)});\n`;
        sqlStatements.push(sql);
        this.logger.info(`SQL statement: ${sql} added to the list`);
      });
    });
    return sqlStatements;
  }

  private abiblityMap(): Map<string, number> {
    const abilityMap = new Map<string, number>();
    this.abilities?.forEach((ability) => {
      abilityMap.set(ability.Name, ability.ID);
    });
    return abilityMap;
  }

  private typeMap(): Map<string, number> {
    const typeMap = new Map<string, number>();
    this.types?.forEach((type) => {
      typeMap.set(type.Name, type.Id);
    });
    return typeMap;
  }
}
