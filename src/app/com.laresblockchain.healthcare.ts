import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace com.laresblockchain.healthcare{
   export class Patient extends Participant {
      patientId: string;
      firstName: string;
      lastName: string;
      birthDate: string;
      doctors: string[];
   }
   export enum Status {
      Live,
      Static,
      Expired,
      Deleted,
   }
   export class Sample extends Asset {
      sampleId: string;
      patient: Patient;
      sampleType: string;
      sampleDate: Date;
      sampleStatus: Status;
      sampleLocation: Address;
      expiryDate: Date;
      storageDate: Date;
   }
   export class Address {
      number: number;
      streetName: string;
      district: string;
      city: string;
      province: string;
      country: string;
      postalCode: string;
   }
   export class Business extends Participant {
      businessId: string;
      businessName: string;
      businessAddress: Address;
      permissions: string[];
      role: string;
   }
   export class Doctor extends Participant {
      doctorId: string;
      businessName: string;
      businessAddress: Address;
      permissions: string[];
      role: string;
   }
   export class Analysis {
      analysisId: number;
      analysisName: string;
      analysis: string;
      business: Business;
   }
   export class CreateSample extends Transaction {
      creator: Business;
      newSample: Sample;
   }
   export class GetSample extends Transaction {
      requestor: Business;
      sample: Sample;
   }
   export class UpdateSample extends Transaction {
      updater: Business;
      sample: Sample;
   }
   export class SampleEvent extends Event {
      sample: Sample;
   }
// }
