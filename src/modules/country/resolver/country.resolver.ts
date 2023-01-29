/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */

import { Query, Resolver } from '@nestjs/graphql';

import { CountryModel } from '../model';
import { CountryService } from '../services';

@Resolver(() => CountryModel)
export class CountryResolver {
  constructor(private countryService: CountryService) {}

  @Query(() => String)
  public async hello(): Promise<any> {
    return 'world';
  }

  @Query(() => [CountryModel])
  public async getCountries(): Promise<CountryModel[]> {
    return this.countryService.getCountries();
  }
}
