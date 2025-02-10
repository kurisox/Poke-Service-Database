import axios from "axios";
import log4js, { Logger } from "log4js";
import { IType } from "./IType";
import { IDamageRelations } from "./IDamageReleation";
import { log } from "console";

const logger: Logger = log4js.getLogger("types.ts");
logger.level = "info";

async function fetchType(id: number) {
  try {
    const fetchedType = await axios.get(
      `https://pokeapi.co/api/v2/type/${id}/`
    );
    const type: IType = {
      id: fetchedType.data.id,
      name: fetchedType.data.name,
      damage_relations: fetchedType.data.damage_relations as IDamageRelations,
    };
    logger.info(`Sucessfully fetched type ${type.id} - ${type.name}`);
    return type;
  } catch (error) {
    logger.error(`Error fetching type with ID ${id}: ${error}`);
    return null;
  }
}

export async function fetchTypes() {
  var counter: number = 1;
  var hasNext = true;
  const types: Set<IType> = new Set();
  do {
    const type = await fetchType(counter);
    if (type !== null) {
      types.add(type);
      counter++;
      logger.info(`Added type ${type.id} - ${type.name} to the set`);
    } else {
      hasNext = false;
    }
  } while (hasNext);
  logger.info(`Fetched ${types.size} types`);
  return types;
}

export function typesSQLStatements(types: Set<IType>) {
  const statements: Set<string> = new Set();
  types.forEach((type) => {
    statements.add(
      `INSERT INTO TYPES (id, type) VALUES (${type.id}, '${type.name}');\n`
    );
  });
  return statements;
}

export function damageRelationsSQLStatements(types: Set<IType>): Set<string> {
  const statements: Set<string> = new Set();
  const typeMap = helperMap(types);

  types.forEach((type) => {
    addDamageRelation(statements, type, typeMap, "no_damage_to"),
      addDamageRelation(statements, type, typeMap, "half_damage_to"),
      addDamageRelation(statements, type, typeMap, "double_damage_to"),
      addDamageRelation(statements, type, typeMap, "no_damage_from"),
      addDamageRelation(statements, type, typeMap, "half_damage_from"),
      addDamageRelation(statements, type, typeMap, "double_damage_from");
  });

  return statements;
}

function addDamageRelation(
  statements: Set<string>,
  type: IType,
  typeMap: Map<string, number>,
  relationKey: keyof IDamageRelations
) {
  const tableName = relationKey.toUpperCase();
  type.damage_relations[relationKey].forEach((relation) => {
    if (typeMap.has(relation.name)) {
      statements.add(
        `INSERT INTO ${tableName}  (type_id, reference_type_id) VALUES (${
          type.id
        }, ${typeMap.get(relation.name)});\n`
      );
    }
  });
}

function helperMap(types: Set<IType>): Map<string, number> {
  const typeMap = new Map<string, number>();
  types.forEach((type) => {
    typeMap.set(type.name, type.id);
  });
  return typeMap;
}
