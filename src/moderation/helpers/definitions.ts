export interface DropdownOption {
  code: string;
  name: string;
}

export const hideShareableListModerationReasonOptions: DropdownOption[] = [
  { code: 'ABUSIVE_BEHAVIOR', name: 'Abusive Behavior' },
  { code: 'POSTING_PRIVATE_INFORMATION', name: 'Posting Private Information' },
  { code: 'HATE_SPEECH', name: 'Hate Speech' },
  { code: 'MISLEADING_INFORMATION', name: 'Misleading Information' },
  { code: 'ADULT_SEXUAL_CONTENT', name: 'Adult Sexual Content' },
  { code: 'CSAM_IMAGES', name: 'CSAM Images' },
  { code: 'CSAM_SOLICITATION', name: 'CSAM Solicitation' },
  { code: 'ILLEGAL_GOODS_AND_SERVICES', name: 'Illegal Goods & Services' },
  { code: 'VIOLENCE_AND_GORE', name: 'Violence & Gore' },
  { code: 'INSTRUCTIONS_FOR_VIOLENCE', name: 'Instructions for Violence' },
  { code: 'INCITEMENT_TO_VIOLENCE', name: 'Incitement to Violence' },
  { code: 'SELF_HARM', name: 'Self Harm' },
  { code: 'TERRORISM', name: 'Terrorism' },
  { code: 'COPYRIGHT', name: 'Copyright' },
  { code: 'TRADEMARK', name: 'Trademark' },
  { code: 'COUNTERFEIT', name: 'Counterfeit' },
  { code: 'SPAM', name: 'Spam' },
  { code: 'FRAUD', name: 'Fraud' },
  { code: 'MALWARE', name: 'Malware' },
  { code: 'PHISHING', name: 'Phishing' },
];

export const GT_DECODED = '>'; // &gt;
export const LT_DECODED = '<'; // &lt;

export const htmlEncodedCharsToFindArr = ['&gt;', '&lt;']; // find these chars
export const replaceWithDecodedCharsArr = [GT_DECODED, LT_DECODED]; // replace with these chars
