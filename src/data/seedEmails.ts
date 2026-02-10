export const SEED_EMAILS = [
  {
    from_name: 'P Rahimunnisa',
    from_email: 'P.Rahimunnisa@sutherlandglobal.com',
    to_name: 'Underwriting Team',
    to_email: 'underwriting@wonderlandglobal.com',
    cc: null,
    subject: 'Broker of Record Appointment – ABC Auto Insurance',
    body: `Dear Underwriting Team,

I hope this email finds you well. Please accept this message as formal notification of a Broker of Record (BOR) change request for the policyholder listed below.

We have attached the completed and signed Broker of Record Letter appointing XYZ Insurance Brokerage LLC as the new broker of record, effective on the date noted in the attachment.

Kindly acknowledge receipt of this request and confirm the effective date of the broker change. Please let us know if any additional documentation is required to process this update.

Thank you for your cooperation.

Sincerely,
Rahimunnisa Pathan
Senior Account Executive
XYZ Insurance Brokerage LLC
Phone: (212) 555-7821
Email: rahimunnisa.pathan@xyzinsurance.com`,
    is_read: false,
    is_flagged: false,
    folder: 'inbox',
    has_attachments: true,
    attachments: [
      {
        file_name: 'Broker of Record Letter.pdf',
        file_type: 'application/pdf',
        file_size: 144206,
        local_path: 'docs/Broker of Record Letter.pdf',
      },
    ],
  },
  {
    from_name: 'P Rahimunnisa',
    from_email: 'P.Rahimunnisa@sutherlandglobal.com',
    to_name: 'Policy Services Team',
    to_email: 'policyservices@wonderlandglobal.com',
    cc: null,
    subject: 'Request for Cancellation of Auto Insurance Policy – Policy #AUTO-TX-4589231',
    body: `Dear Policy Services Team,

I hope this message finds you well. I am writing to formally request the cancellation of the below-referenced vehicle insurance policy.

Please find the completed and signed Cancellation Request Form (PDF) along with supporting documents (JPG images) attached for your review and processing.

Kindly confirm receipt of this request and advise the effective date of cancellation, along with any applicable refund details, if available. Should you require any additional information or documentation, please let us know.

Thank you for your assistance.

Sincerely,
Rahimunnisa Pathan
Senior Account Executive
XYZ Insurance Brokerage LLC
Phone: (212) 555-7821
Email: rahimunnisa.pathan@xyzinsurance.com`,
    is_read: false,
    is_flagged: false,
    folder: 'inbox',
    has_attachments: true,
    attachments: [
      {
        file_name: 'Policyholder Information.pdf',
        file_type: 'application/pdf',
        file_size: 68571,
        local_path: 'docs/Policyholder Information.pdf',
      },
      {
        file_name: 'Proof of Vehicle Sale.heic',
        file_type: 'image/heic',
        file_size: 10355,
        local_path: 'docs/Proof of Vehicle Sale.heic',
      },
    ],
  },
  {
    from_name: 'P Rahimunnisa',
    from_email: 'P.Rahimunnisa@sutherlandglobal.com',
    to_name: 'Collector Vehicle Insurance Team',
    to_email: 'collectorvehicle@wonderlandglobal.com',
    cc: null,
    subject: 'Request for Collector Vehicle Insurance Quote – 1967 Ford Mustang',
    body: `Dear Collector Vehicle Insurance Team,

I hope you are doing well. I am writing to request a collector vehicle insurance quote for my classic vehicle. Please find the completed Collector Vehicle Insurance Application Form attached for your review.

Kindly let me know if any additional information or documentation is required to proceed with the quote.

Thank you for your time and assistance. I look forward to your response.

Sincerely,
Rahimunnisa Pathan
Senior Account Executive
XYZ Insurance Brokerage LLC
Phone: (212) 555-7821
Email: rahimunnisa.pathan@xyzinsurance.com`,
    is_read: false,
    is_flagged: false,
    folder: 'inbox',
    has_attachments: true,
    attachments: [
      {
        file_name: 'Collector_Vehicle_Insurance_Application.pdf',
        file_type: 'application/pdf',
        file_size: 208402,
        local_path: 'docs/Collector_Vehicle_Insurance_Application.pdf',
      },
      {
        file_name: 'Collector Vehicle Insurance Application Form.docx',
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        file_size: 786793,
        local_path: 'docs/Collector Vehicle Insurance Application Form.docx',
      },
    ],
  },
];

export const REPLY_TEMPLATE = {
  from_name: 'Wonderland Team',
  from_email: 'Emailprocessing@wonderlandglobal.com',
  to_name: 'P Rahimunnisa',
  to_email: 'P.Rahimunnisa@sutherlandglobal.com',
};
