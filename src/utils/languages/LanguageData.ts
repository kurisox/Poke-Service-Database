export default class LanguageData {
  private readonly id: number;
  private readonly name: string;

  public constructor(builder: LanguageBuilder) {
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
    return new LanguageBuilder();
  }
}

class LanguageBuilder {
  public id?: number;
  public name?: string;

  public setId(id: number): LanguageBuilder {
    this.id = id;
    return this;
  }

  public setName(name: string): LanguageBuilder {
    this.name = name;
    return this;
  }

  public build(): LanguageData {
    return new LanguageData(this);
  }
}