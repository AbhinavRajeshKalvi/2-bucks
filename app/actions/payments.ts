'use server';

import crypto from 'crypto';

import { verifySession } from '@/app/lib/dal';
import { getProductById } from '@/app/lib/products-db';

import {
  createEntry,
} from '@/app/lib/entries-db';

import {
  createPaymentOrderRecord,
  getPaymentOrderByRazorpayId,
  markPaymentOrderPaid,
} from '@/app/lib/payment-orders-db';

import { razorpay } from '@/app/lib/razorpay';

import { ENTRY_PRICE } from '@/app/lib/data';

// ─────────────────────────────────────────────
// CREATE RAZORPAY ORDER
// ─────────────────────────────────────────────

export type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createRazorpayOrder(
  productId: string,
  quantity: number
): Promise<CreateOrderResult> {
  const session = await verifySession();

  if (!session) {
    return {
      success: false,
      message:
        'Please sign in to purchase entries.',
    };
  }

  if (
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return {
      success: false,
      message:
        'Invalid entry quantity.',
    };
  }

  const product =
    await getProductById(productId);

  if (!product) {
    return {
      success: false,
      message:
        'Product not found.',
    };
  }

  if (
    new Date(product.endsAt).getTime() <=
    Date.now()
  ) {
    return {
      success: false,
      message:
        'This draw has already closed.',
    };
  }

  // For now the count is still zero.
  // We will replace this with getEntryCount()
  // once the entry count is wired into the UI.
  const filled = 0;

  const remaining =
    product.totalSlots - filled;

  if (remaining <= 0) {
    return {
      success: false,
      message:
        'This draw is already full.',
    };
  }

  if (quantity > remaining) {
    return {
      success: false,
      message:
        `Only ${remaining.toLocaleString(
          'en-IN'
        )} entries are remaining.`,
    };
  }

  const amount =
    quantity * ENTRY_PRICE;

  // Razorpay expects the amount in paise.
  const amountInPaise =
    amount * 100;

  try {
    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',

        receipt:
          `product_${productId}_${Date.now()}`,

        notes: {
          productId,
          userId: session.userId,
          quantity: String(quantity),
        },
      });

    await createPaymentOrderRecord({
      userId: session.userId,
      productId,
      quantity,
      amount,
      razorpayOrderId:
        razorpayOrder.id,
    });

    return {
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId:
        process.env.RAZORPAY_KEY_ID!,
    };
  } catch (error) {
    console.error(
      'Razorpay order creation error:',
      error
    );

    return {
      success: false,
      message:
        'Unable to create the payment order. Please try again.',
    };
  }
}

// ─────────────────────────────────────────────
// VERIFY PAYMENT
// ─────────────────────────────────────────────

export type VerifyPaymentResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<VerifyPaymentResult> {
  const session =
    await verifySession();

  if (!session) {
    return {
      success: false,
      message:
        'Your session expired. Please sign in again.',
    };
  }

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return {
      success: false,
      message:
        'Invalid payment response.',
    };
  }

  try {
    // Retrieve the order we created on our server.
    const paymentOrder =
      await getPaymentOrderByRazorpayId(
        razorpayOrderId
      );

    if (!paymentOrder) {
      return {
        success: false,
        message:
          'Payment order not found.',
      };
    }

    // Make sure the payment order belongs
    // to the currently authenticated user.
    if (
      paymentOrder.userId !==
      session.userId
    ) {
      return {
        success: false,
        message:
          'You are not authorised to verify this payment.',
      };
    }

    // The signature must be generated using
    // the ORDER ID that came from our server,
    // not a client-supplied order ID.
    const payload =
      `${paymentOrder.razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env
            .RAZORPAY_KEY_SECRET!
        )
        .update(payload)
        .digest('hex');

    const signaturesMatch =
      crypto.timingSafeEqual(
        Buffer.from(
          expectedSignature
        ),
        Buffer.from(
          razorpaySignature
        )
      );

    if (!signaturesMatch) {
      return {
        success: false,
        message:
          'Payment verification failed.',
      };
    }

    // Idempotency:
    // if this payment was already processed,
    // don't create another entry.
    if (
      paymentOrder.status ===
        'paid' &&
      paymentOrder.razorpayPaymentId
    ) {
      return {
        success: true,
      };
    }

    await markPaymentOrderPaid(
      paymentOrder.razorpayOrderId,
      razorpayPaymentId
    );

    await createEntry({
      userId: paymentOrder.userId,
      productId:
        paymentOrder.productId,
      quantity:
        paymentOrder.quantity,
      amount:
        paymentOrder.amount,
      razorpayOrderId:
        paymentOrder.razorpayOrderId,
      razorpayPaymentId,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      'Razorpay payment verification error:',
      error
    );

    return {
      success: false,
      message:
        'Unable to verify the payment.',
    };
  }
}