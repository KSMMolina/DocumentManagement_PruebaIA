import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceCharacter' })
export class ReplaceCharacterPipe implements PipeTransform {
  transform(text: string, replace: string, by: string): string {
    return text.replaceAll(replace, by);
  }
}
