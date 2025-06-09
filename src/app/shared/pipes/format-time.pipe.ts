import { Pipe, PipeTransform } from '@angular/core';
import { formatDuration } from 'date-fns';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(totalMinutes: number): string {
    if (totalMinutes === null || isNaN(totalMinutes)) return '';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return formatDuration({ hours, minutes });
  }
}
