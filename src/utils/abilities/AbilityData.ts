export default class AbilityData{
    private readonly id: number;
    private readonly name: string;
    private readonly generation: string;
    private readonly effect: any[];
    private readonly flavorText: any[];
    private readonly pokemonName: any[];

    constructor(builder: AbilityBuilder) {
        this.id = builder.id!;
        this.name = builder.name!;
        this.generation = builder.generation!;
        this.effect = builder.effect!;
        this.flavorText = builder.flavorText!;
        this.pokemonName = builder.pokemonName!;
    }

    public get ID() {
        return this.id;
    }

    public get Name() {
        return this.name;
    }

    public get Generation() {
        return this.generation;
    }

    public get Effect() {
        return this.effect;
    }

    public get FlavorText() {
        return this.flavorText;
    }

    public get PokemonName() {
        return this.pokemonName;
    }


    public static get Builder() {
        return new AbilityBuilder();
    }
}

class AbilityBuilder {
    public id?: number;
    public name?: string;
    public generation?: string;
    public effect?: any[];
    public flavorText?: any[];
    public pokemonName?: any[];

    public setId(id: number): AbilityBuilder {
        this.id = id;
        return this;
    }

    public setName(name: string): AbilityBuilder {
        this.name = name;
        return this;
    }

    public setGeneration(generation: string): AbilityBuilder {
        this.generation = generation;
        return this;
    }

    public setEffect(effect: any[]): AbilityBuilder {
        this.effect = effect;
        return this;
    }

    public setFlavorText(flavorText: any[]): AbilityBuilder {
        this.flavorText = flavorText;
        return this;
    }

    public setPokemonName(pokemonName: any[]): AbilityBuilder {
        this.pokemonName = pokemonName;
        return this;
    }

    public build(): AbilityData {
        return new AbilityData(this);
    }
}
