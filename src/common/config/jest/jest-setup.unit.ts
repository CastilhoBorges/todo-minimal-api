/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Provider } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';

export class JestSetupUnit<T> {
  private providersData: any;

  constructor(providers: any) {
    this.providersData = { ...providers };
  }

  getProvider() {
    return { ...this.providersData } as T;
  }

  async getServices(skipClass: any[]) {
    const services = {};
    const providers = Object.values(
      this.providersData || { klass: { prototype: {} } },
    ).map((klass) => {
      const clss = klass as any;

      const methods = Object.getOwnPropertyNames(clss.prototype).filter(
        (name) => name !== 'constructor',
      );

      const mock: any = {};
      const skip = skipClass.find((klasse) => klasse.name === clss.name);

      if (skip) {
        return skip;
      }

      methods.forEach((method) => {
        mock[method] = jest.fn();
      });

      const classExtends = Object.getPrototypeOf(clss);

      if (classExtends.name) {
        const methodsExtends = Object.getOwnPropertyNames(
          classExtends.prototype,
        ).filter((name) => name !== 'constructor');

        methodsExtends.forEach((method) => {
          mock[method] = jest.fn();
        });
      }

      return {
        provide: klass,
        useValue: mock,
      };
    }) as Provider[];

    const module: TestingModule = await Test.createTestingModule({
      providers,
    }).compile();

    Object.values(this.providersData || { klass: { name: '' } }).forEach(
      (klass) => {
        const ct = klass as any;
        const key = ct.name.charAt(0).toLowerCase() + ct.name.slice(1);
        services[key] = module.get<typeof klass>(klass as Function);
      },
    );

    jest.clearAllMocks();
    jest.resetAllMocks();

    return services as T;
  }

  describeDefinedServices(services) {
    describe('should be defined', () => {
      Object.keys(services).forEach((key) => {
        const service = services[key];
        it(`${service.name}`, () => {
          expect(service).toBeDefined();
        });
      });
    });
  }
}
