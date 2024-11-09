import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { __awaiter } from 'tslib';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private apiKey:      string = '9cgaHhV6BI5D1YU4WgDrL7kER7LAvdJW';
  private serviceUrl:  string = 'https://api.giphy.com/v1/gifs';


  constructor( private http: HttpClient ) {
    this.loadLocalStorage(); //Llamamos a este método solo cuando  el servicio es inyectado por primera vez y solo ahí
    console.log('Gifs Services Ready')
  }


  get tagHistory() {
    return [...this._tagHistory];
  }


  private organizeHistory(tag : string) {
    tag = tag.toLowerCase();

    if ( this._tagHistory.includes(tag) ) {
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag !== tag)
    }

    this._tagHistory.unshift( tag );
    this._tagHistory = this._tagHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this.tagHistory )); //Para salvar el historial en el local storage
  }

  private loadLocalStorage(): void {

    if( !localStorage.getItem('history') ) return; // si NO(!) hay historial no hace nada, sale directamente de la función

    this._tagHistory = JSON.parse( localStorage.getItem('history')! );

    if ( this._tagHistory.length === 0 ) return;
    this.searchTag( this._tagHistory[0] );

    }

  searchTag( tag: string ):void {
    if ( tag.length === 0 ) return;
    this.organizeHistory( tag );

    const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', 10 )
      .set('q', tag )

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;
        console.log({gifs: this.gifList});
      });

  }
}
