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
import { BusinessService } from './Business.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-business',
  templateUrl: './Business.component.html',
  styleUrls: ['./Business.component.css'],
  providers: [BusinessService]
})
export class BusinessComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  businessId = new FormControl('', Validators.required);
  businessName = new FormControl('', Validators.required);
  businessAddress = new FormControl('', Validators.required);
  permissions = new FormControl('', Validators.required);
  role = new FormControl('', Validators.required);


  constructor(public serviceBusiness: BusinessService, fb: FormBuilder) {
    this.myForm = fb.group({
      businessId: this.businessId,
      businessName: this.businessName,
      businessAddress: this.businessAddress,
      permissions: this.permissions,
      role: this.role
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceBusiness.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'com.laresblockchain.healthcare.Business',
      'businessId': this.businessId.value,
      'businessName': this.businessName.value,
      'businessAddress': this.businessAddress.value,
      'permissions': this.permissions.value,
      'role': this.role.value
    };

    this.myForm.setValue({
      'businessId': null,
      'businessName': null,
      'businessAddress': null,
      'permissions': null,
      'role': null
    });

    return this.serviceBusiness.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'businessId': null,
        'businessName': null,
        'businessAddress': null,
        'permissions': null,
        'role': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'com.laresblockchain.healthcare.Business',
      'businessName': this.businessName.value,
      'businessAddress': this.businessAddress.value,
      'permissions': this.permissions.value,
      'role': this.role.value
    };

    return this.serviceBusiness.updateParticipant(form.get('businessId').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceBusiness.deleteParticipant(this.currentId)
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

    return this.serviceBusiness.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'businessId': null,
        'businessName': null,
        'businessAddress': null,
        'permissions': null,
        'role': null
      };

      if (result.businessId) {
        formObject.businessId = result.businessId;
      } else {
        formObject.businessId = null;
      }

      if (result.businessName) {
        formObject.businessName = result.businessName;
      } else {
        formObject.businessName = null;
      }

      if (result.businessAddress) {
        formObject.businessAddress = result.businessAddress;
      } else {
        formObject.businessAddress = null;
      }

      if (result.permissions) {
        formObject.permissions = result.permissions;
      } else {
        formObject.permissions = null;
      }

      if (result.role) {
        formObject.role = result.role;
      } else {
        formObject.role = null;
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
      'businessId': null,
      'businessName': null,
      'businessAddress': null,
      'permissions': null,
      'role': null
    });
  }
}
