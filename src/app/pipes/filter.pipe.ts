import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param users list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(users: any[], searchText: string): any[] {
    console.log("pipe users", users);
    if (!users) {
      return [];
    }
    if (!searchText) {
      return users;
    }
    searchText = searchText.toLocaleLowerCase();
    return users.filter(it => {
        console.log("it user", it);
      return it.toLocaleLowerCase().includes(searchText);
    });
  }
}