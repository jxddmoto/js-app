/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SampleService } from './Sample.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-sample',
  templateUrl: './Sample.component.html',
  styleUrls: ['./Sample.component.css'],
  providers: [SampleService]
})
export class SampleComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  sampleId = new FormControl('', Validators.required);
  patient = new FormControl('', Validators.required);
  sampleType = new FormControl('', Validators.required);
  sampleDate = new FormControl('', Validators.required);
  sampleStatus = new FormControl('', Validators.required);
  sampleLocation = new FormControl('', Validators.required);
  expiryDate = new FormControl('', Validators.required);
  storageDate = new FormControl('', Validators.required);

  constructor(public serviceSample: SampleService, fb: FormBuilder) {
    this.myForm = fb.group({
      sampleId: this.sampleId,
      patient: this.patient,
      sampleType: this.sampleType,
      sampleDate: this.sampleDate,
      sampleStatus: this.sampleStatus,
      sampleLocation: this.sampleLocation,
      expiryDate: this.expiryDate,
      storageDate: this.storageDate
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceSample.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'com.laresblockchain.healthcare.Sample',
      'sampleId': this.sampleId.value,
      'patient': this.patient.value,
      'sampleType': this.sampleType.value,
      'sampleDate': this.sampleDate.value,
      'sampleStatus': this.sampleStatus.value,
      'sampleLocation': this.sampleLocation.value,
      'expiryDate': this.expiryDate.value,
      'storageDate': this.storageDate.value
    };

    this.myForm.setValue({
      'sampleId': null,
      'patient': null,
      'sampleType': null,
      'sampleDate': null,
      'sampleStatus': null,
      'sampleLocation': null,
      'expiryDate': null,
      'storageDate': null
    });

    return this.serviceSample.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'sampleId': null,
        'patient': null,
        'sampleType': null,
        'sampleDate': null,
        'sampleStatus': null,
        'sampleLocation': null,
        'expiryDate': null,
        'storageDate': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'com.laresblockchain.healthcare.Sample',
      'patient': this.patient.value,
      'sampleType': this.sampleType.value,
      'sampleDate': this.sampleDate.value,
      'sampleStatus': this.sampleStatus.value,
      'sampleLocation': this.sampleLocation.value,
      'expiryDate': this.expiryDate.value,
      'storageDate': this.storageDate.value
    };

    return this.serviceSample.updateAsset(form.get('sampleId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceSample.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceSample.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'sampleId': null,
        'patient': null,
        'sampleType': null,
        'sampleDate': null,
        'sampleStatus': null,
        'sampleLocation': null,
        'expiryDate': null,
        'storageDate': null
      };

      if (result.sampleId) {
        formObject.sampleId = result.sampleId;
      } else {
        formObject.sampleId = null;
      }

      if (result.patient) {
        formObject.patient = result.patient;
      } else {
        formObject.patient = null;
      }

      if (result.sampleType) {
        formObject.sampleType = result.sampleType;
      } else {
        formObject.sampleType = null;
      }

      if (result.sampleDate) {
        formObject.sampleDate = result.sampleDate;
      } else {
        formObject.sampleDate = null;
      }

      if (result.sampleStatus) {
        formObject.sampleStatus = result.sampleStatus;
      } else {
        formObject.sampleStatus = null;
      }

      if (result.sampleLocation) {
        formObject.sampleLocation = result.sampleLocation;
      } else {
        formObject.sampleLocation = null;
      }

      if (result.expiryDate) {
        formObject.expiryDate = result.expiryDate;
      } else {
        formObject.expiryDate = null;
      }

      if (result.storageDate) {
        formObject.storageDate = result.storageDate;
      } else {
        formObject.storageDate = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'sampleId': null,
      'patient': null,
      'sampleType': null,
      'sampleDate': null,
      'sampleStatus': null,
      'sampleLocation': null,
      'expiryDate': null,
      'storageDate': null
      });
  }

}
