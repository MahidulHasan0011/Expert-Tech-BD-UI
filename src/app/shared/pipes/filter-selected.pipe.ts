import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSelected'
})
export class FilterSelectedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
