import axios from "axios";
import log4js, { Logger } from "log4js";
import ISQL from "../interfaces/ISQL";
import IFetching from "../interfaces/IFechting";
import TypeData from "./TypeData";
import DamageRelationsData, { DamageRelationData } from "./DamageRelationsData";

export default class TypeProvider
  implements IFetching<TypeData>, ISQL<TypeData>
{
  private logger: Logger;
  private typeArray: TypeData[];

  constructor() {
    this.logger = log4js.getLogger("TypeProvider.ts");
    this.logger.level = "info";
    this.typeArray = [];
  }

  public async fetchAllData() {
    let id: number = 1;
    let hasNext = true;
    do {
      try {
        const typeData = await axios.get(
          `https://pokeapi.co/api/v2/type/${id}/`
        );
        this.extractData(typeData.data);
        id++;
      } catch (error) {
        this.logger.error(`Error fetching type with ID ${id}: ${error}`);
        hasNext = false;
      }
    } while (hasNext);
  }

  extractData(data: any): void {
    const damageRelations = DamageRelationsData.Builder.setDoubleDamageFrom(
      data.damage_relations.double_damage_from.map((relation: any) =>
        DamageRelationData.Builder.setName(relation.name)
          .setUrl(relation.url)
          .build()
      )
    )
      .setDoubleDamageTo(
        data.damage_relations.double_damage_to.map((relation: any) =>
          DamageRelationData.Builder.setName(relation.name)
            .setUrl(relation.url)
            .build()
        )
      )
      .setHalfDamageFrom(
        data.damage_relations.half_damage_from.map((relation: any) =>
          DamageRelationData.Builder.setName(relation.name)
            .setUrl(relation.url)
            .build()
        )
      )
      .setHalfDamageTo(
        data.damage_relations.half_damage_to.map((relation: any) =>
          DamageRelationData.Builder.setName(relation.name)
            .setUrl(relation.url)
            .build()
        )
      )
      .setNoDamageFrom(
        data.damage_relations.no_damage_from.map((relation: any) =>
          DamageRelationData.Builder.setName(relation.name)
            .setUrl(relation.url)
            .build()
        )
      )
      .setNoDamageTo(
        data.damage_relations.no_damage_to.map((relation: any) =>
          DamageRelationData.Builder.setName(relation.name)
            .setUrl(relation.url)
            .build()
        )
      )
      .build();

    const type: TypeData = TypeData.Builder.setId(data.id)
      .setName(data.name)
      .setDamageRelations(damageRelations)
      .build();

    this.logger.info(`Successfully fetched type ${type.Id} - ${type.Name}`);
    this.logger.info(
      type.DamageRelations["double_damage_to"].map((relation) => relation.Name)
    );
    this.typeArray.push(type);
  }

  getData(): TypeData[] {
    return this.typeArray;
  }

  createSQLStatements(data: TypeData[]): string[] {
    const sqlStatements: string[] = [];
    const typeMap = this.helperMap(data);
    sqlStatements.push(...this.createTypeStatements(data));
    data.forEach((type) => {
      sqlStatements.push(
        ...this.createDamageRelationsStatements(
          type,
          typeMap,
          "double_damage_to"
        )
      );
      sqlStatements.push(
        ...this.createDamageRelationsStatements(
          type,
          typeMap,
          "double_damage_from"
        )
      );
      sqlStatements.push(
        ...this.createDamageRelationsStatements(type, typeMap, "half_damage_to")
      );
      sqlStatements.push(
        ...this.createDamageRelationsStatements(
          type,
          typeMap,
          "half_damage_from"
        )
      );
      sqlStatements.push(
        ...this.createDamageRelationsStatements(type, typeMap, "no_damage_to")
      );
      sqlStatements.push(
        ...this.createDamageRelationsStatements(type, typeMap, "no_damage_from")
      );
    });
    return sqlStatements;
  }

  private createTypeStatements(data: TypeData[]): string[] {
    const sqlStatements: string[] = [];
    data.forEach((type) => {
      const sqlStatement: string = `INSERT INTO TYPES (id, type) VALUES (${type.Id}, '${type.Name}');\n`;
      sqlStatements.push(sqlStatement);
      this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
    });
    return sqlStatements;
  }

  private createDamageRelationsStatements(
    type: TypeData,
    typeMap: Map<String, number>,
    key: keyof DamageRelationsData
  ): string[] {
    const sqlStatements: string[] = [];
    const tablename = key.toLocaleUpperCase();
    type.DamageRelations[key].forEach((relation: DamageRelationData) => {
      if (typeMap.has(relation.Name)) {
        const sqlStatement: string = `INSERT INTO ${tablename} (type_id, reference_type_id) VALUES (${
          type.Id
        }, ${typeMap.get(relation.Name)});\n`;
        sqlStatements.push(sqlStatement);
        this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
      }
    });
    return sqlStatements;
  }

  private helperMap(types: TypeData[]): Map<string, number> {
    const typeMap = new Map<string, number>();
    types.forEach((type) => {
      typeMap.set(type.Name, type.Id);
      this.logger.info(
        `Type ${type.Name} - ${typeMap.get(type.Name)} added to the map`
      );
    });
    return typeMap;
  }
}
