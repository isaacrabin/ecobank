import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './_services/api.service';

import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.getDropDowns();
  }


  getDropDowns() {
    this.getCountries();
    this.getBranches();
    this.getRelationships();
    this.getOccupations();
    this.getIndustry();
    this.getEmployers();
    this.getIncomes();
    this.getCurrencies();
  }
    // Get Branches
    getBranches() {
      this.apiService.getBranches().subscribe((res) => {
        if (res.successful) {
          localStorage.setItem("branches", JSON.stringify(res.object.info));
        }
      });
    }
    // Get Industries
    getCountries() {
      this.apiService.getCountries().subscribe(async (res) => {
        if (res.successful) {
          const countries = await res.object.info;
          let country = [];
          const filterArrayOfCountries = countries.filter(
            (c: any) => c.countryCode === "KE"
          );
          const other = filterArrayOfCountries[0];
          country = [{ ...other }, ...countries];
          localStorage.setItem("countries", JSON.stringify(country));
        }
      });
    }

    // Get Relationships
    getRelationships() {
      this.apiService.getRelationships().subscribe((res) => {
        if (res.successful) {
          localStorage.setItem("relationships", JSON.stringify(res.object.info));
        }
      });
    }

    // Get list of occupations
    getOccupations() {
      this.apiService.getOccupations().subscribe((res) => {
        if (res.successful) {
          localStorage.setItem("occupations", JSON.stringify(res.object.info));
        }
      });
    }

    // Get list of industries
    getIndustry() {
      this.apiService.getIndustries().subscribe((res) => {
        if (res.successful) {
          localStorage.setItem("industries", JSON.stringify(res.object.info));
        }
      });
    }

    // Get employer
    getEmployers() {
      this.apiService.getEmployers().subscribe((res) => {
        if (res.successful) {
          const employers = res.object.info;
          const filterArrayOfEmployers = employers.filter(
            (e: any) => e.companyName === "OTHER"
          );
          const other = filterArrayOfEmployers[0];
          other.companyName = "OTHER (If not available on the list)";
          const employer = [{ ...other }, ...employers];
          localStorage.setItem("employers", JSON.stringify(employer));
        }
      });
    }

    // Get monthly income
    getIncomes() {
      this.apiService.getIncomes().subscribe((res) => {
        if (res.successful) {
          localStorage.setItem("incomes", JSON.stringify(res.object.info));
        }
      });
    }

    // Get List of currencies
    getCurrencies() {
      this.apiService.getCurrencies().subscribe((res) => {
        if (res.successful) {
          localStorage.setItem("currencies", JSON.stringify(res.object.info));
        }
      });
    }
}
