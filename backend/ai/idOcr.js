/**
 * Stubbed OCR extractor (no external API). Returns placeholder data to keep the
 * flow running without Google Cloud. Replace with a provider-specific
 * implementation when ready.
 */
export const extractIdData = async ({ frontImage, backImage, idType }) => {
  if (!frontImage || !backImage) {
    throw new Error('frontImage and backImage are required');
  }

  // Minimal deterministic placeholders so the UI can be tested end-to-end.
  const seed = Date.now().toString().slice(-6);
  return {
    idNumber: `ID-${seed}`,
    surname: 'Dela Cruz',
    givenName: 'Juan',
    middleName: 'Santos',
    dateOfBirth: '1990-01-15',
    nationality: 'Filipino',
    sex: 'Male',
    placeOfBirth: 'Pangasinan',
    dateOfIssue: '2022-05-10',
    expiryDate: '2032-05-10',
    issuingAuthority: 'ID Authority',
    rawText: 'stubbed',
    idType
  };
};

export default extractIdData;
