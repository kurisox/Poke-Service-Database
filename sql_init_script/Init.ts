import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import log4js, { Logger } from "log4js";

import LanguagesProvider from "../src/utils/languages/LanguagesProvider.ts";
import GenerationProvider from "../src/utils/generations/GenerationsProvider.ts";
import TypeProvider from "../src/utils/types/TypeProvider.ts";
import IFetching from "../src/utils/interfaces/IDataServer.ts";

class Init {
  private logger: Logger;
  private readonly __filename = fileURLToPath(import.meta.url);
  private readonly __dirname = path.dirname(this.__filename);
  private readonly initSqlPath = path.join(this.__dirname, "init.sql");
  private sqlStatements: string[];
  private objects: IFetching<any>[];
  private languagesProvider: LanguagesProvider;
  private generationProvider: GenerationProvider;
  private typeProvider: TypeProvider;

  constructor(logLevel: string) {
    this.logger = log4js.getLogger("Init.ts");
    this.logger.level = logLevel;
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    this.initSqlPath = path.join(this.__dirname, "init.sql");
    this.sqlStatements = [];
    this.objects = [];
    this.languagesProvider = new LanguagesProvider();
    this.generationProvider = new GenerationProvider();
    this.typeProvider = new TypeProvider();
    this.objects.push(this.languagesProvider);
    this.objects.push(this.generationProvider);
    this.objects.push(this.typeProvider);
  }

  private async prepareData() {
    try {
      this.objects.forEach(element => {
        element.fetchAllData();
      });
    } catch (error) {
      this.logger.error(`Error preparing data: ${error}`);
    }
  }

  private statementCollector() {
    this.collectStatements(
      "language",
      this.languagesProvider.getData(),
      this.languagesProvider.createSQLStatements.bind(this.languagesProvider)
    );
    this.collectStatements(
      "generation",
      this.generationProvider.getData(),
      this.generationProvider.createSQLStatements.bind(this.generationProvider)
    );
    this.collectStatements(
      "type",
      this.typeProvider.getData(),
      this.typeProvider.createSQLStatements.bind(this.typeProvider)
    );
  }

  private collectStatements<T>(
    name: string,
    data: T[],
    createSQLStatements: (data: T[]) => string[]
  ) {
    this.logger.info(`Collecting ${name} statements`);
    this.sqlStatements.push(...createSQLStatements(data));

    this.logger.info(`${name} statements added to the array`);
  }

  //populates the init.sql script with the statements
  private populateSQLScript() {
    this.logger.info("Populating init.sql with statements");
    this.sqlStatements.forEach((statement: string) => {
      fs.appendFileSync(this.initSqlPath, statement);
      this.logger.info(`Statement ${statement} added to init.sql`);
    });
    this.logger.info("init.sql populated with statements");
  }

  public async main() {
    this.logger.info("Starting init.ts");
    await this.prepareData();
    this.statementCollector();
    this.populateSQLScript();
  }
}

const inits = new Init("info");
inits.main();
