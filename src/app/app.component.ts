import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, Params, ActivatedRoute } from '@angular/router';
 import language from './language.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  language_data:any;

  txtname: string = "";
  txtemail: string = "";
  cbfeedback_type: string = "";
  txttitle: string = "";
  txtmessage: string = "";
  enable_spinner = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" [innerHTML]="spinner_status"></span> Sending...';
  disable_spinner = 'Send';
  btn_status = "";

  button_disabled = false;

  ngOnInit() {
    this.btn_status = this.disable_spinner;
  }
  constructor(private http: HttpClient, private activatedRoute:ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      // this.changeLanguage(params.lg);
      if(params.lg=="en"){
        this.language_data = language.en;
      }else if(params.lg=="la"){
        this.language_data = language.la;
      }else{
        this.language_data = language.en;
      }
    });
  }
  sendData() {
    if (this.txtemail != "" && this.txtmessage != "" && this.txtname != "" && this.txttitle != "" && this.cbfeedback_type != "") {
      let data = {
        "name": this.txtname,
        "email": this.txtemail,
        "feedback_type": this.cbfeedback_type,
        "title": this.txttitle,
        "message": this.txtmessage
      }
      this.btn_status = this.enable_spinner;
      this.button_disabled = true;

      this.http.post<any>('http://localhost:8080/api/public/submit_feedback', data).subscribe(result => {
        if (result.res == "success") {
          window.alert("You successful send feedback!");
          this.txtname = "";
          this.txtemail = "";
          this.cbfeedback_type = "";
          this.txttitle = "";
          this.txtmessage = "";

          this.btn_status = this.disable_spinner;
          this.button_disabled = false;

        } else {
          window.alert(result.res);

          this.btn_status = this.disable_spinner;
          this.button_disabled = false;
        }
      }, (err: HttpErrorResponse) => {
        window.alert("your feedback could not be send!, error code:"+err.status+" "+err.statusText);

        this.btn_status = this.disable_spinner;
        this.button_disabled = false;
      });
    } else {
      if (this.txtname != "") {
        if (this.txtemail != "") {
          if (this.cbfeedback_type != "") {
            if (this.txttitle != "") {
              if (this.txtmessage == "") {
                window.alert(this.language_data.null_message);
              }
            } else {
              window.alert(this.language_data.null_title);
            }
          } else {
            window.alert(this.language_data.null_feedback_type);
          }
        } else {
          window.alert(this.language_data.null_email);
        }
      } else {
        window.alert(this.language_data.null_name);
      }
    }
  }
}
