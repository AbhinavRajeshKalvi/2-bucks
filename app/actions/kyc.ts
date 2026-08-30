'use server';

import {
  createSession,
  deleteSignupDraft,
  getSignupDraft,
  updateSignupDraft,
} from '@/app/lib/session';

import {
  createUser,
  getUserByEmail,
} from '@/app/lib/users-db';

import {
  issueOtp,
  checkOtp,
} from '@/app/lib/otp-store';

import {
  validateUploadedFile,
  saveUserFile,
} from '@/app/lib/uploads';

const PHONE_REGEX = /^[6-9]\d{9}$/;
const AADHAAR_REGEX = /^\d{12}$/;

// ─────────────────────────────────────────────
// SEND OTP
// ─────────────────────────────────────────────

export type SendOtpResult =
  | {
      success: true;
      devCode: string;
      cooldownActive: boolean;
      expiresInSeconds: number;
    }
  | {
      success: false;
      message: string;
    };

export async function sendOtp(
  rawPhone: string
): Promise<SendOtpResult> {
  const draft = await getSignupDraft();

  if (!draft) {
    return {
      success: false,
      message:
        'Your signup session expired. Please start again.',
    };
  }

  const phone = rawPhone.replace(/\D/g, '');

  if (!PHONE_REGEX.test(phone)) {
    return {
      success: false,
      message:
        'Enter a valid 10-digit Indian mobile number.',
    };
  }

  const { code, cooldownActive } =
    issueOtp(
      draft.draftId,
      phone
    );

  return {
    success: true,
    devCode: code,
    cooldownActive,
    expiresInSeconds: 300,
  };
}

// ─────────────────────────────────────────────
// VERIFY OTP
// ─────────────────────────────────────────────

export type VerifyOtpResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function verifyOtp(
  rawCode: string
): Promise<VerifyOtpResult> {
  const draft = await getSignupDraft();

  if (!draft) {
    return {
      success: false,
      message:
        'Your signup session expired. Please start again.',
    };
  }

  const code = rawCode.trim();

  const result = checkOtp(
    draft.draftId,
    code
  );

  if (!result.ok) {
    const messages: Record<
      typeof result.reason,
      string
    > = {
      no_otp:
        'Request a code first.',
      expired:
        'That code expired. Send a new one.',
      too_many_attempts:
        'Too many incorrect attempts. Send a new code.',
      mismatch:
        'Incorrect code. Please try again.',
    };

    return {
      success: false,
      message:
        messages[result.reason],
    };
  }

  await updateSignupDraft({
    phone: result.phone,
    phoneVerifiedAt: Date.now(),
  });

  return {
    success: true,
  };
}

// ─────────────────────────────────────────────
// SUBMIT AADHAAR
// ─────────────────────────────────────────────

export type SubmitAadhaarResult =
  | {
      success: true;
    }
  | {
      success: false;
      message?: string;
      fieldErrors?: Record<
        string,
        string[]
      >;
    };

export async function submitAadhaar(
  formData: FormData
): Promise<SubmitAadhaarResult> {
  const draft = await getSignupDraft();

  if (!draft) {
    return {
      success: false,
      message:
        'Your signup session expired. Please start again.',
    };
  }

  // Phone verification must happen first.
  if (
    !draft.phoneVerifiedAt ||
    !draft.phone
  ) {
    return {
      success: false,
      message:
        'Please verify your mobile number first.',
    };
  }

  const rawAadhaar = String(
    formData.get('aadhaarNumber') ?? ''
  ).replace(/\s/g, '');

  // Safely extract the front file.
  const frontValue =
    formData.get('front');

  const front =
    frontValue instanceof File
      ? frontValue
      : null;

  // Safely extract the back file.
  const backValue =
    formData.get('back');

  const back =
    backValue instanceof File
      ? backValue
      : null;

  const fieldErrors: Record<
    string,
    string[]
  > = {};

  // ─────────────────────────────────────────
  // VALIDATE AADHAAR NUMBER
  // ─────────────────────────────────────────

  if (
    !AADHAAR_REGEX.test(
      rawAadhaar
    )
  ) {
    fieldErrors.aadhaarNumber = [
      'Enter a valid 12-digit Aadhaar number.',
    ];
  }

  // ─────────────────────────────────────────
  // VALIDATE FRONT
  // ─────────────────────────────────────────

  if (
    !front ||
    front.size === 0
  ) {
    fieldErrors.front = [
      'Please upload the front of your Aadhaar.',
    ];
  } else {
    const err =
      validateUploadedFile(front);

    if (err === 'too_large') {
      fieldErrors.front = [
        'File is too large (max 5MB).',
      ];
    }

    if (err === 'bad_type') {
      fieldErrors.front = [
        'Only JPG, PNG or PDF files are accepted.',
      ];
    }
  }

  // ─────────────────────────────────────────
  // VALIDATE BACK
  // ─────────────────────────────────────────

  if (
    back &&
    back.size > 0
  ) {
    const err =
      validateUploadedFile(back);

    if (err === 'too_large') {
      fieldErrors.back = [
        'File is too large (max 5MB).',
      ];
    }

    if (err === 'bad_type') {
      fieldErrors.back = [
        'Only JPG, PNG or PDF files are accepted.',
      ];
    }
  }

  // Stop when validation fails.
  if (
    Object.keys(fieldErrors)
      .length > 0
  ) {
    return {
      success: false,
      fieldErrors,
    };
  }

  /*
   * At this point the validation above guarantees
   * that front exists and is a File.
   *
   * The explicit cast makes the type contract
   * unambiguous for the production TypeScript
   * build used by Render.
   */
  const validFront =
    front as File;

  // ─────────────────────────────────────────
  // UPLOAD AADHAAR
  // ─────────────────────────────────────────

  try {
    const aadhaarFrontPublicId =
      await saveUserFile(
        draft.draftId,
        'aadhaar-front',
        validFront
      );

    let aadhaarBackPublicId:
      string | undefined;

    if (
      back &&
      back.size > 0
    ) {
      aadhaarBackPublicId =
        await saveUserFile(
          draft.draftId,
          'aadhaar-back',
          back
        );
    }

    // Store temporary KYC information.
    // The real user is not created yet.
    await updateSignupDraft({
      aadhaarLast4:
        rawAadhaar.slice(-4),

      aadhaarSubmittedAt:
        Date.now(),

      aadhaarFrontPublicId,

      ...(aadhaarBackPublicId
        ? {
            aadhaarBackPublicId,
          }
        : {}),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      'Aadhaar upload error:',
      error
    );

    return {
      success: false,
      message:
        'Could not save your documents. Please try again.',
    };
  }
}

// ─────────────────────────────────────────────
// SUBMIT SELFIE
// ─────────────────────────────────────────────

export type SubmitSelfieResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function submitSelfie(
  formData: FormData
): Promise<SubmitSelfieResult> {
  const draft = await getSignupDraft();

  if (!draft) {
    return {
      success: false,
      message:
        'Your signup session expired. Please start again.',
    };
  }

  // Phone must be verified first.
  if (
    !draft.phoneVerifiedAt ||
    !draft.phone
  ) {
    return {
      success: false,
      message:
        'Please verify your mobile number first.',
    };
  }

  // Aadhaar must be submitted first.
  if (
    !draft.aadhaarSubmittedAt ||
    !draft.aadhaarFrontPublicId
  ) {
    return {
      success: false,
      message:
        'Please submit your Aadhaar documents first.',
    };
  }

  // Safely extract the selfie file.
  const photoValue =
    formData.get('photo');

  const photo =
    photoValue instanceof File
      ? photoValue
      : null;

  // Validate selfie exists.
  if (
    !photo ||
    photo.size === 0
  ) {
    return {
      success: false,
      message:
        'Please take a photo before continuing.',
    };
  }

  const err =
    validateUploadedFile(photo);

  if (err) {
    return {
      success: false,
      message:
        err === 'too_large'
          ? 'Photo is too large.'
          : 'Unsupported photo format.',
    };
  }

  /*
   * The checks above guarantee that photo
   * exists and is a valid File.
   *
   * Explicitly cast it so TypeScript cannot
   * treat it as File | null during the
   * Cloudinary upload.
   */
  const validPhoto =
    photo as File;

  // ─────────────────────────────────────────
  // COMPLETE SIGNUP
  // ─────────────────────────────────────────

  try {
    // Check one final time that the email
    // hasn't been registered by another account.
    const existingUser =
      await getUserByEmail(
        draft.email
      );

    if (existingUser) {
      return {
        success: false,
        message:
          'An account with this email already exists.',
      };
    }

    // Upload selfie to Cloudinary.
    const selfiePublicId =
      await saveUserFile(
        draft.draftId,
        'selfie',
        validPhoto
      );

    // ───────────────────────────────────────
    // CREATE REAL USER
    // ───────────────────────────────────────

    const user =
      await createUser({
        name: draft.name,

        email: draft.email,

        passwordHash:
          draft.passwordHash,

        phone: draft.phone,

        phoneVerifiedAt:
          draft.phoneVerifiedAt
            ? new Date(
                draft.phoneVerifiedAt
              ).toISOString()
            : undefined,

        aadhaarLast4:
          draft.aadhaarLast4,

        aadhaarSubmittedAt:
          draft.aadhaarSubmittedAt
            ? new Date(
                draft.aadhaarSubmittedAt
              ).toISOString()
            : undefined,

        aadhaarFrontPublicId:
          draft.aadhaarFrontPublicId,

        aadhaarBackPublicId:
          draft.aadhaarBackPublicId,

        selfieSubmittedAt:
          new Date().toISOString(),

        selfiePublicId,
      });

    // ───────────────────────────────────────
    // CREATE PERMANENT SESSION
    // ───────────────────────────────────────

    await createSession(
      user.id
    );

    // Remove temporary signup state.
    await deleteSignupDraft();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      'Selfie submission error:',
      error
    );

    return {
      success: false,
      message:
        'Could not complete your registration. Please try again.',
    };
  }
}