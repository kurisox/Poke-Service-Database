import axios from "axios";
import log4js, { Logger } from "log4js";
import LanguageData from "./LanguageData";
import ISQL from "../interfaces/ISQL";
import IFetching from "../interfaces/IFechting";

export default class LanguagesProvider
  implements IFetching<LanguageData>, ISQL<LanguageData>
{
  private logger: Logger;
  private languageArray: LanguageData[];

  constructor() {
    this.logger = log4js.getLogger("LanguageProvider.ts");
    this.logger.level = "info";
    this.languageArray = [];
  }

  public async fetchAllData() {
    try {
      const languageData = await axios.get(
        "https://pokeapi.co/api/v2/language/"
      );
      this.logger.info("Sucessfully fetched language data");
      this.extractData(languageData.data.results);
    } catch (error) {
      this.logger.error(`Error fetching language data: ${error}`);
    }
  }

  public extractData(languageData: any) {
    let counter = 1;
    languageData.forEach((element: { name: string; }) => {
      this.logger.info(
        `Extracting data for language ${counter}-${element.name}`
      );
      const language: LanguageData = LanguageData.Builder.setId(counter)
        .setName(element.name)
        .build();
      this.languageArray.push(language);
      counter++;
      this.logger.info(
        `Data for language ${language.ID}-${language.Name} sucessfully extracted and pushed to the array`
      );
    });
  }

  public getData(): LanguageData[] {
    return this.languageArray;
  }

  public createSQLStatements(languages: LanguageData[]): string[] {
    const sqlStatements: string[] = [];
    languages.forEach((language) => {
      const sqlStatement: string = `INSERT INTO LANGUAGES (id, name) VALUES (${language.ID}, '${language.Name}');\n`;
      sqlStatements.push(sqlStatement);
      this.logger.info(`SQL statement: ${sqlStatement} added to the list`);
    });
    return sqlStatements;
  }
}
