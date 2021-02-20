import { duplicateObjectByJsonStringifyParse } from '~/shared';
import {
  ICheckerEx,
  vObject,
  vString,
} from '~/shared/modules/SchemaValidationHelper';
import { appEnv } from '~/shell/base';
import { fsExistsSync, fsxReadJsonFile, fsxWriteJsonFile } from '~/shell/funcs';

export interface IApplicationPersistData {
  pageState: {
    currentPagePath: string;
  };
}

const defaultPersistData: IApplicationPersistData = {
  pageState: {
    currentPagePath: '/',
  },
};

const applicationPersistDataSchemaChecker = vObject({
  pageState: vObject({
    currentPagePath: vString(),
  }),
});
class ApplicationStorage {
  private configFilePath = appEnv.resolveUserDataFilePath('data/config.json');
  private data: { [key: string]: any } = defaultPersistData;

  getItem0<K extends keyof IApplicationPersistData>(
    key: K,
  ): IApplicationPersistData[K] {
    return this.data[key];
  }

  setItem0<K extends keyof IApplicationPersistData>(
    key: K,
    value: IApplicationPersistData[K],
  ) {
    this.data[key] = value;
  }

  readItem<T>(key: string): T | undefined {
    return this.data[key];
  }

  readItemSafe<T>(
    key: string,
    schemaChecker: ICheckerEx,
    fallbackSource: T | (() => T),
  ): T {
    const value = this.data[key];
    const errors = schemaChecker(value);
    if (errors) {
      console.error(`invalid persist data for ${key}`);
      console.error(JSON.stringify(errors, null, '  '));
      if (fallbackSource instanceof Function) {
        return fallbackSource();
      } else {
        return duplicateObjectByJsonStringifyParse(fallbackSource);
      }
    }
    return value;
  }

  writeItem<T>(key: string, value: T) {
    this.data[key] = value;
  }

  async initializeAsync() {
    if (!fsExistsSync(this.configFilePath)) {
      console.log('config file not found!');
      return;
    }
    const obj = (await fsxReadJsonFile(
      this.configFilePath,
    )) as IApplicationPersistData;
    // const errors = applicationPersistDataSchemaChecker(obj);
    // if (errors) {
    //   console.error(`application persist data schema error`);
    //   console.log(JSON.stringify(errors, null, '  '));
    // } else {
    //   this.data = obj;
    // }
    this.data = obj;
  }

  async terminateAsync() {
    console.log(`saving persist state`);
    await fsxWriteJsonFile(this.configFilePath, this.data);
  }
}

export const applicationStorage = new ApplicationStorage();
