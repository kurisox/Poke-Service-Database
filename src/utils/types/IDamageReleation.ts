interface IDamageRelation {
    name: string;
    url: string;
}

export interface IDamageRelations {
    no_damage_to: IDamageRelation[];
    half_damage_to: IDamageRelation[];
    double_damage_to: IDamageRelation[];
    no_damage_from: IDamageRelation[];
    half_damage_from: IDamageRelation[];
    double_damage_from: IDamageRelation[];
  }