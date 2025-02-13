import DamageRelationsData from './DamageRelationsData';

export default class TypeData {
    private readonly id: number;
    private readonly name: string;
    private readonly damage_relations: DamageRelationsData;

    constructor(builder: TypeBuilder){
        this.id = builder.id!;
        this.name = builder.name!;
        this.damage_relations = builder.damage_relations!;
    }

    public get Id(){
        return this.id;
    }

    public get Name(){
        return this.name;
    }

    public get DamageRelations(){
        return this.damage_relations;
    }

    public static get Builder(){
        return new TypeBuilder();
    }
}

class TypeBuilder{
    public id?: number;
    public name?: string;
    public damage_relations?: DamageRelationsData;

    public setId(id: number): TypeBuilder{
        this.id = id;
        return this;
    }

    public setName(name: string): TypeBuilder{
        this.name = name;
        return this;
    }

    public setDamageRelations(damage_relations: DamageRelationsData): TypeBuilder{
        this.damage_relations = damage_relations;
        return this;
    }

    public build(): TypeData{
        return new TypeData(this);
    }
}