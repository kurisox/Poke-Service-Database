export class DamageRelationData {
  private readonly name: string;
  private readonly url: string;	

  constructor(builder: DamageRelationBuilder) {
    this.name = builder.name!;
    this.url = builder.url!;
  }

  public get Name() {
    return this.name;
  }

  public static get Builder() {
    return new DamageRelationBuilder();
  }
}

class DamageRelationBuilder {
  public name?: string;
    public url?: string;

  public setName(name: string): DamageRelationBuilder {
    this.name = name;
    return this;
  }

    public setUrl(url: string): DamageRelationBuilder {
        this.url = url;
        return this;
    }

  public build(): DamageRelationData {
    return new DamageRelationData(this);
  }
}

export default class DamageRelationsData {
  readonly double_damage_from: DamageRelationData[];
  readonly double_damage_to: DamageRelationData[];
  readonly half_damage_from: DamageRelationData[];
  readonly half_damage_to: DamageRelationData[];
  readonly no_damage_from: DamageRelationData[];
  readonly no_damage_to: DamageRelationData[];

  constructor(builder: DamageRelationsBuilder) {
    this.double_damage_from = builder.double_damage_from!;
    this.double_damage_to = builder.double_damage_to!;
    this.half_damage_from = builder.half_damage_from!;
    this.half_damage_to = builder.half_damage_to!;
    this.no_damage_from = builder.no_damage_from!;
    this.no_damage_to = builder.no_damage_to!;
  }

  public get DoubleDamageFrom() {
    return this.double_damage_from;
  }

  public get DoubleDamageTo() {
    return this.double_damage_to;
  }

  public get HalfDamageFrom() {
    return this.half_damage_from;
  }

  public get HalfDamageTo() {
    return this.half_damage_to;
  }

  public get NoDamageFrom() {
    return this.no_damage_from;
  }

  public get NoDamageTo() {
    return this.no_damage_to;
  }

  public static get Builder() {
    return new DamageRelationsBuilder();
  }
}

class DamageRelationsBuilder {
  public double_damage_from?: DamageRelationData[];
  public double_damage_to?: DamageRelationData[];
  public half_damage_from?: DamageRelationData[];
  public half_damage_to?: DamageRelationData[];
  public no_damage_from?: DamageRelationData[];
  public no_damage_to?: DamageRelationData[];

  public setDoubleDamageFrom(
    double_damage_from: DamageRelationData[]
  ): DamageRelationsBuilder {
    this.double_damage_from = double_damage_from;
    return this;
  }

  public setDoubleDamageTo(double_damage_to: DamageRelationData[]): DamageRelationsBuilder {
    this.double_damage_to = double_damage_to;
    return this;
  }

  public setHalfDamageFrom(half_damage_from: DamageRelationData[]): DamageRelationsBuilder {
    this.half_damage_from = half_damage_from;
    return this;
  }

  public setHalfDamageTo(half_damage_to: DamageRelationData[]): DamageRelationsBuilder {
    this.half_damage_to = half_damage_to;
    return this;
  }

  public setNoDamageFrom(no_damage_from: DamageRelationData[]): DamageRelationsBuilder {
    this.no_damage_from = no_damage_from;
    return this;
  }

  public setNoDamageTo(no_damage_to: DamageRelationData[]): DamageRelationsBuilder {
    this.no_damage_to = no_damage_to;
    return this;
  }

  public build(): DamageRelationsData {
    return new DamageRelationsData(this);
  }
}
