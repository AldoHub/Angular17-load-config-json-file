import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'ang-settings';

  public settingService = inject(SettingsService);

  ngOnInit(): void {
    console.log("this prop is coming from the config file: ", this.settingService.baseUrl)
  }


}
