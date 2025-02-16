export default class PokemonData {
    private readonly id: number;
    private readonly name: string;
    private readonly height: number;
    private readonly weight: number;
    private readonly abilities: string[];
    private readonly types: string[];
    private readonly sprites: any[];

    constructor(builder: PokemonBuilder) {
        this.id = builder.id!;
        this.name = builder.name!;
        this.height = builder.height!;
        this.weight = builder.weight!;
        this.abilities = builder.abilities!;
        this.types = builder.types!;
        this.sprites = builder.sprites!;
    }

    public get ID() {
        return this.id;
    }

    public get Name() {
        return this.name;
    }

    public get Height() {
        return this.height;
    }
    
    public get Weight() {
        return this.weight;
    }

    public get Abilities() {
        return this.abilities;
    }

    public get Types() {
        return this.types;
    }

    public get Sprites() {
        return this.sprites;
    }

    public static get Builder() {
        return new PokemonBuilder();
    }
}


class PokemonBuilder {
    public id?: number;
    public name?: string;
    public height?: number;
    public weight?: number;
    public abilities?: string[];
    public types?: string[];
    public sprites?: any[];

    public setId(id: number): PokemonBuilder {
        this.id = id;
        return this;
    }

    public setName(name: string): PokemonBuilder {
        this.name = name;
        return this;
    }

    public setHeight(height: number): PokemonBuilder {
        this.height = height;
        return this;
    }

    public setWeight(weight: number): PokemonBuilder {
        this.weight = weight;
        return this;
    }

    public setAbilities(abilities: string[]): PokemonBuilder {
        this.abilities = abilities;
        return this;
    }

    public setTypes(types: string[]): PokemonBuilder {
        this.types = types;
        return this;
    }

    public setSprites(sprites: any[]): PokemonBuilder {
        this.sprites = sprites;
        return this;
    }

    public build(): PokemonData {
        return new PokemonData(this);
    }
}