import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { SettingsService } from './settings.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(), // use the provider function - no modules are used here
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        //inject the service that will need the data
        const settingsService = inject(SettingsService);
        const httpService = inject(HttpClient);

        return () => {
          new Promise((resolve) => {

            //use "ng g environments"
            if(environment.production){
            
              //--- FOR DEPLOY/PRODUCTION 

              //--- use "ng build --configuration production" 

              //this will require the config.json to be uploaded as well with the rest
              //of the dist folder contents - else will not be found
              //if SSR is used add it on the browser folder
              httpService.get("./config.json")
              .pipe(
                tap((data: any) => {
                  settingsService.baseUrl = data.baseUrl;
                  resolve(true);
                }),
                catchError((error) => {
                  console.log("some error happened: ", error)
                  //set a backup for the needed data
                  settingsService.baseUrl = "http://backup.dev";
                  resolve(true);
                  //return
                  return of(null)
                })
              ).subscribe();

            }else{
            
              //--- FOR LOCAL DEVELOPMENT     
                 
              const settings = require('../../config.json');
              //reading config file on the root dir
              console.log("CONFIG FILE: ", settings);
              //set the service properties using the json config
              settingsService.baseUrl = settings.baseUrl;
              resolve(true);
            }
            
          })
        }
      },
      multi: true
    }
  ]
};
