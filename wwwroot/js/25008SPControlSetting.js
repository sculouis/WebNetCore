var _currentSetting;
var _controlSetting = [
  {
      "FlowKey": "SP_P1_01",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "disable"
        }
      ],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "disable"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_01",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "edit"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "edit"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "edit"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "edit"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "edit"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "edit"
        }
      ],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "edit"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_01",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "edit"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "edit"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "edit"
        }
      ],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "disable"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_01",
      "CurrentStep": 3,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "disable"
        }
      ],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "disable"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_01",
      "CurrentStep": 4,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "disable"
        }
      ],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "edit"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_02",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_02",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "edit"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "edit"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_02",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "edit"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "edit"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "edit"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_04",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "disable"
        }
      ],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_04",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "edit"
        }
      ],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_04",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "edit"
        }
      ],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_05",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "disable"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_05",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "edit"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_05",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "edit"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_06",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_06",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_06",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_07",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_07",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_07",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_08",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_08",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_08",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_08",
      "CurrentStep": 3,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_09",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_09",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_09",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_10",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_10",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_10",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_10",
      "CurrentStep": 3,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_11",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_11",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_11",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_11",
      "CurrentStep": 3,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_12",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_12",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_12",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_12",
      "CurrentStep": 3,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_12",
      "CurrentStep": 4,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_13",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "disable"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_13",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "edit"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_13",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "ShowAppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendBankAcount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [],
      "BankAccount": [
        {
            "controlName": "DeleteBankAccount",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankCountry",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BranchNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetSwiftCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "SwiftCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "BankAccountName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemittanceCheckCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "BankAccountDescription",
            "fieldStatus": "edit"
        }
      ]
  },
  {
      "FlowKey": "SP_P1_14",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "disable"
        }
      ],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_14",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "edit"
        }
      ],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_14",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "ShowAppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "AppendContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [],
      "Contact": [
        {
            "controlName": "DeleteContact",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonLastName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PersonFirstName",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "EmailAddress",
            "fieldStatus": "edit"
        },
        {
            "controlName": "ContactDescription",
            "fieldStatus": "edit"
        }
      ],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_15",
      "CurrentStep": -1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_15",
      "CurrentStep": 1,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_15",
      "CurrentStep": 2,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "edit"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_15",
      "CurrentStep": 3,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "edit"
        },
        {
            "controlName": "Country",
            "fieldStatus": "edit"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "edit"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "disable"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "edit"
        }
      ],
      "Contact": [],
      "BankAccount": []
  },
  {
      "FlowKey": "SP_P1_15",
      "CurrentStep": 4,
      "Main": [
        {
            "controlName": "AppendSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "UpdateSupplier",
            "fieldStatus": "hide"
        },
        {
            "controlName": "VendorDescription",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorNameAlt",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ToCardDepartment",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorTypeLookupCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VatRegistrationNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyName",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ParentCompanyVatNum",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SelfAssessmentformDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "selfAssessmentTo",
            "fieldStatus": "disable"
        },
        {
            "controlName": "CommitmentDocDate",
            "fieldStatus": "disable"
        },
        {
            "controlName": "commitmentDocumentTo",
            "fieldStatus": "disable"
        }
      ],
      "Site": [
        {
            "controlName": "DeleteSite",
            "fieldStatus": "disable"
        },
        {
            "controlName": "ActiveFlag",
            "fieldStatus": "disable"
        },
        {
            "controlName": "VendorSiteCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "SitePurpose",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PhoneNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "FaxNumber",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostalCode1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "PostCode2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address1",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Address2",
            "fieldStatus": "disable"
        },
        {
            "controlName": "Country",
            "fieldStatus": "disable"
        },
        {
            "controlName": "IdentifyType",
            "fieldStatus": "disable"
        },
        {
            "controlName": "TaxCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetTaxCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "TaxPrint",
            "fieldStatus": "disable"
        },
        {
            "controlName": "LiabilityCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetLiabilityCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PrepayCode",
            "fieldStatus": "disable"
        },
        {
            "controlName": "GetPrepayCode",
            "fieldStatus": "hide"
        },
        {
            "controlName": "PayGroupLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentMethodLookupCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceDeliveryMethod",
            "fieldStatus": "edit"
        },
        {
            "controlName": "RemitAdviceEmail",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PaymentReasonCode",
            "fieldStatus": "edit"
        },
        {
            "controlName": "PayAlone",
            "fieldStatus": "edit"
        },
        {
            "controlName": "SameAddress",
            "fieldStatus": "hide"
        }
      ],
      "Contact": [],
      "BankAccount": []
  }
];