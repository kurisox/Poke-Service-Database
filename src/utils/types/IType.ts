import { IDamageRelations } from "./IDamageReleation";

export interface IType {
    id: number;
    name: string;
    damage_relations: IDamageRelations;
}

