export default class GenerationData{
    private readonly id: number;
    private readonly name: string;

    public constructor(builder: GenerationBuilder) {
        this.id = builder.id!;
        this.name = builder.name!;
    }

    public get ID() {
        return this.id;
    }

    public get Name() {
        return this.name;
    }

    public static get Builder() {
        return new GenerationBuilder();
    }
}

class GenerationBuilder {
    public id?: number;
    public name?: string;

    public setId(id: number): GenerationBuilder {
        this.id = id;
        return this;
    }

    public setName(name: string): GenerationBuilder {
        this.name = name;
        return this;
    }

    public build(): GenerationData {
        return new GenerationData(this);
    }
}