'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  ArrowLeft,
  Clock,
  Users,
  Shield,
  Minus,
  Plus,
  Zap,
} from 'lucide-react';

import {
  formatINR,
  getFillPercentage,
  getFillColor,
  getTimeRemaining,
  ENTRY_PRICE,
} from '@/app/lib/data';

import type {
  StoredProduct,
} from '@/app/lib/products-db';

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '@/app/actions/payments';

// ─────────────────────────────────────────────
// RAZORPAY TYPES
// ─────────────────────────────────────────────

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  theme?: {
    color?: string;
  };

  handler?: (
    response: RazorpaySuccessResponse
  ) => void;
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay: new (
      options: RazorpayOptions
    ) => RazorpayInstance;
  }
}

// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────

type ProductPageClientProps = {
  product: StoredProduct | null;
  filled: number;
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function ProductPageClient({
  product,
  filled,
}: ProductPageClientProps) {
  const [quantity, setQuantity] =
    useState(1);

  const [isPaying, setIsPaying] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  // ─────────────────────────────────────────
  // PRODUCT NOT FOUND
  // ─────────────────────────────────────────

  if (!product) {
    return (
      <div
        style={{
          paddingTop: '96px',
          textAlign: 'center',
          color: '#8A9BBE',
        }}
      >
        <p>Product not found.</p>

        <Link
          href="/"
          style={{
            color: '#F5C518',
          }}
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  // From this point onward, TypeScript knows
  // that currentProduct can never be null.
  const currentProduct: StoredProduct =
    product;

  // ─────────────────────────────────────────
  // CALCULATIONS
  // ─────────────────────────────────────────

  const pct =
    getFillPercentage(
      filled,
      currentProduct.totalSlots
    );

  const fillColor =
    getFillColor(pct);

  const slotsRemaining =
    Math.max(
      0,
      currentProduct.totalSlots -
        filled
    );

  const total =
    quantity * ENTRY_PRICE;

  // ─────────────────────────────────────────
  // LOAD RAZORPAY CHECKOUT
  // ─────────────────────────────────────────

  async function loadRazorpay(): Promise<void> {
    if (window.Razorpay) {
      return;
    }

    await new Promise<void>(
      (resolve, reject) => {
        const existingScript =
          document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
          );

        if (existingScript) {
          existingScript.addEventListener(
            'load',
            () => resolve()
          );

          existingScript.addEventListener(
            'error',
            () =>
              reject(
                new Error(
                  'Could not load Razorpay Checkout.'
                )
              )
          );

          return;
        }

        const script =
          document.createElement(
            'script'
          );

        script.src =
          'https://checkout.razorpay.com/v1/checkout.js';

        script.async = true;

        script.onload = () =>
          resolve();

        script.onerror = () =>
          reject(
            new Error(
              'Could not load Razorpay Checkout.'
            )
          );

        document.body.appendChild(
          script
        );
      }
    );
  }

  // ─────────────────────────────────────────
  // START PAYMENT
  // ─────────────────────────────────────────

  async function handleBuy() {
    if (isPaying) {
      return;
    }

    if (slotsRemaining <= 0) {
      setPaymentError(
        'This draw is full.'
      );

      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > slotsRemaining
    ) {
      setPaymentError(
        'Invalid entry quantity.'
      );

      return;
    }

    setPaymentError(null);
    setPaymentSuccess(false);
    setIsPaying(true);

    try {
      // Create the Razorpay order on the server.
      const result =
        await createRazorpayOrder(
          currentProduct.id,
          quantity
        );

      if (!result.success) {
        setPaymentError(
          result.message
        );

        return;
      }

      // Load Razorpay Checkout.
      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error(
          'Razorpay Checkout is unavailable.'
        );
      }

      const options:
        RazorpayOptions = {
        key: result.keyId,

        amount: result.amount,

        currency:
          result.currency,

        name: '2Bucks',

        description:
          `${currentProduct.name} — ${quantity} ${
            quantity === 1
              ? 'entry'
              : 'entries'
          }`,

        order_id:
          result.orderId,

        theme: {
          color: '#F5C518',
        },

        handler: async (
          response
        ) => {
          setIsPaying(true);
          setPaymentError(null);

          try {
            // Verify the payment on the server.
            const verification =
              await verifyRazorpayPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );

            if (!verification.success) {
              setPaymentError(
                verification.message
              );

              return;
            }

            // Payment verified and entry created.
            setPaymentSuccess(true);

            setQuantity(1);

            // Reload so the server fetches
            // the latest entry count.
            window.location.reload();
          } catch (error) {
            console.error(
              'Payment verification error:',
              error
            );

            setPaymentError(
              'Payment verification failed. Please contact support.'
            );
          } finally {
            setIsPaying(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();
    } catch (error) {
      console.error(
        'Payment initialization error:',
        error
      );

      setPaymentError(
        'Unable to start the payment. Please try again.'
      );
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <div
      style={{
        paddingTop: '96px',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ─────────────────────────────── */}
        {/* BACK */}
        {/* ─────────────────────────────── */}

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8A9BBE',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={16} />
          Back to all products
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >

          {/* ─────────────────────────────── */}
          {/* LEFT: IMAGE */}
          {/* ─────────────────────────────── */}

          <div>
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#0A1628',
                aspectRatio: '4/3',
              }}
            >
              <img
                src={
                  currentProduct.imageUrl
                }
                alt={
                  currentProduct.name
                }
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '10px',
                marginTop: '16px',
              }}
            >
              {[
                {
                  icon: '🛡️',
                  text: 'Aadhaar verified draw',
                },
                {
                  icon: '🎲',
                  text: 'Provably fair random',
                },
                {
                  icon: '🚚',
                  text: 'Free delivery to winner',
                },
                {
                  icon: '💳',
                  text: 'Razorpay secured',
                },
              ].map(
                ({ icon, text }) => (
                  <div
                    key={text}
                    style={{
                      background:
                        '#1E2A45',
                      border:
                        '1px solid #2A3A5C',
                      borderRadius:
                        '10px',
                      padding:
                        '10px 12px',
                      fontSize:
                        '12px',
                      color:
                        '#8A9BBE',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap: '8px',
                    }}
                  >
                    <span>
                      {icon}
                    </span>

                    {text}
                  </div>
                )
              )}
            </div>
          </div>

          {/* ─────────────────────────────── */}
          {/* RIGHT: DETAILS */}
          {/* ─────────────────────────────── */}

          <div>
            <span
              style={{
                color: '#8A9BBE',
                fontSize: '12px',
                fontWeight: 600,
                textTransform:
                  'uppercase',
                letterSpacing:
                  '0.5px',
              }}
            >
              {currentProduct.brand} ·{' '}
              {currentProduct.category}
            </span>

            <h1
              style={{
                color: '#F0EDE6',
                fontSize:
                  'clamp(22px, 4vw, 32px)',
                fontWeight: 800,
                marginTop: '6px',
                marginBottom: '12px',
                letterSpacing:
                  '-0.5px',
              }}
            >
              {currentProduct.name}
            </h1>

            <p
              style={{
                color: '#8A9BBE',
                fontSize: '15px',
                lineHeight: '1.7',
                marginBottom: '24px',
              }}
            >
              {currentProduct.description}
            </p>

            {/* ─────────────────────────── */}
            {/* VALUE */}
            {/* ─────────────────────────── */}

            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '24px',
                padding: '16px',
                background:
                  '#1E2A45',
                border:
                  '1px solid #2A3A5C',
                borderRadius:
                  '12px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#8A9BBE',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform:
                      'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Product Value
                </div>

                <div
                  className="gold-text"
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                  }}
                >
                  {formatINR(
                    currentProduct.value
                  )}
                </div>
              </div>

              <div
                style={{
                  width: '1px',
                  background:
                    '#2A3A5C',
                }}
              />

              <div>
                <div
                  style={{
                    color: '#8A9BBE',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform:
                      'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Entry Price
                </div>

                <div
                  style={{
                    color: '#22C55E',
                    fontSize: '24px',
                    fontWeight: 800,
                  }}
                >
                  ₹{ENTRY_PRICE}
                </div>
              </div>

              <div
                style={{
                  width: '1px',
                  background:
                    '#2A3A5C',
                }}
              />

              <div>
                <div
                  style={{
                    color: '#8A9BBE',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform:
                      'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Time Left
                </div>

                <div
                  style={{
                    color:
                      pct >= 90
                        ? '#E8364F'
                        : '#F0EDE6',
                    fontSize:
                      '16px',
                    fontWeight: 700,
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap: '6px',
                  }}
                >
                  <Clock size={14} />

                  {getTimeRemaining(
                    currentProduct.endsAt
                  )}
                </div>
              </div>
            </div>

            {/* ─────────────────────────── */}
            {/* FILL BAR */}
            {/* ─────────────────────────── */}

            <div
              style={{
                marginBottom:
                  '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  marginBottom:
                    '8px',
                }}
              >
                <span
                  style={{
                    color:
                      '#8A9BBE',
                    fontSize:
                      '13px',
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap: '5px',
                  }}
                >
                  <Users size={13} />

                  {filled.toLocaleString(
                    'en-IN'
                  )}{' '}
                  /{' '}
                  {currentProduct.totalSlots.toLocaleString(
                    'en-IN'
                  )}{' '}
                  entries
                </span>

                <span
                  style={{
                    fontSize:
                      '13px',
                    fontWeight: 700,
                    color:
                      fillColor,
                  }}
                >
                  {pct}% filled
                </span>
              </div>

              <div
                style={{
                  background:
                    '#0A0F1E',
                  borderRadius:
                    '100px',
                  height: '10px',
                  overflow:
                    'hidden',
                }}
              >
                <div
                  style={{
                    width:
                      `${pct}%`,
                    height: '100%',
                    background:
                      `linear-gradient(90deg, ${fillColor}99, ${fillColor})`,
                    borderRadius:
                      '100px',
                    transition:
                      'width 0.8s ease',
                  }}
                />
              </div>

              <div
                style={{
                  color:
                    '#8A9BBE',
                  fontSize:
                    '12px',
                  marginTop:
                    '6px',
                }}
              >
                {slotsRemaining.toLocaleString(
                  'en-IN'
                )}{' '}
                slots remaining
              </div>
            </div>

            {/* ─────────────────────────── */}
            {/* QUANTITY SELECTOR */}
            {/* ─────────────────────────── */}

            <div
              style={{
                marginBottom:
                  '20px',
              }}
            >
              <div
                style={{
                  color:
                    '#8A9BBE',
                  fontSize:
                    '13px',
                  fontWeight: 600,
                  marginBottom:
                    '10px',
                }}
              >
                Number of entries
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() =>
                    setQuantity(
                      (q) =>
                        Math.max(
                          1,
                          q - 1
                        )
                    )
                  }
                  disabled={
                    isPaying
                  }
                  style={{
                    background:
                      '#1E2A45',
                    border:
                      '1px solid #2A3A5C',
                    borderRadius:
                      '8px',
                    padding:
                      '10px',
                    color:
                      '#F0EDE6',
                    cursor:
                      isPaying
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      isPaying
                        ? 0.5
                        : 1,
                  }}
                >
                  <Minus size={16} />
                </button>

                <span
                  style={{
                    color:
                      '#F0EDE6',
                    fontSize:
                      '20px',
                    fontWeight:
                      700,
                    minWidth:
                      '50px',
                    textAlign:
                      'center',
                  }}
                >
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(
                      (q) =>
                        Math.min(
                          q + 1,
                          slotsRemaining
                        )
                    )
                  }
                  disabled={
                    isPaying ||
                    quantity >=
                      slotsRemaining
                  }
                  style={{
                    background:
                      '#1E2A45',
                    border:
                      '1px solid #2A3A5C',
                    borderRadius:
                      '8px',
                    padding:
                      '10px',
                    color:
                      '#F0EDE6',
                    cursor:
                      isPaying ||
                      quantity >=
                        slotsRemaining
                        ? 'not-allowed'
                        : 'pointer',
                    opacity:
                      isPaying ||
                      quantity >=
                        slotsRemaining
                        ? 0.5
                        : 1,
                  }}
                >
                  <Plus size={16} />
                </button>

                <div
                  style={{
                    marginLeft:
                      '8px',
                  }}
                >
                  <div
                    style={{
                      color:
                        '#8A9BBE',
                      fontSize:
                        '11px',
                    }}
                  >
                    Total cost
                  </div>

                  <div
                    className="gold-text"
                    style={{
                      fontSize:
                        '20px',
                      fontWeight: 800,
                    }}
                  >
                    ₹{total}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop:
                    '12px',
                }}
              >
                {[5, 10, 25, 50].map(
                  (n) => {
                    const available =
                      n <=
                      slotsRemaining;

                    return (
                      <button
                        key={n}
                        onClick={() =>
                          setQuantity(
                            Math.min(
                              n,
                              slotsRemaining
                            )
                          )
                        }
                        disabled={
                          isPaying ||
                          !available
                        }
                        style={{
                          padding:
                            '5px 12px',
                          borderRadius:
                            '6px',
                          fontSize:
                            '12px',
                          fontWeight:
                            600,
                          cursor:
                            isPaying ||
                            !available
                              ? 'not-allowed'
                              : 'pointer',
                          border:
                            quantity ===
                              n &&
                            available
                              ? '1px solid #F5C518'
                              : '1px solid #2A3A5C',
                          background:
                            quantity ===
                              n &&
                            available
                              ? '#F5C51818'
                              : 'transparent',
                          color:
                            quantity ===
                              n &&
                            available
                              ? '#F5C518'
                              : '#8A9BBE',
                          opacity:
                            available
                              ? 1
                              : 0.4,
                        }}
                      >
                        ×{n}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* ─────────────────────────── */}
            {/* PAYMENT SUCCESS */}
            {/* ─────────────────────────── */}

            {paymentSuccess && (
              <p
                style={{
                  color:
                    '#22C55E',
                  fontSize:
                    '12px',
                  textAlign:
                    'center',
                  marginTop:
                    '10px',
                  marginBottom:
                    '12px',
                }}
              >
                Payment successful. Your
                entries have been confirmed.
              </p>
            )}

            {/* ─────────────────────────── */}
            {/* PAYMENT ERROR */}
            {/* ─────────────────────────── */}

            {paymentError && (
              <p
                style={{
                  color:
                    '#E8364F',
                  fontSize:
                    '12px',
                  textAlign:
                    'center',
                  marginTop:
                    '10px',
                  marginBottom:
                    '12px',
                }}
              >
                {paymentError}
              </p>
            )}

            {/* ─────────────────────────── */}
            {/* CTA */}
            {/* ─────────────────────────── */}

            <button
              onClick={handleBuy}
              disabled={
                isPaying ||
                slotsRemaining <= 0
              }
              style={{
                width: '100%',
                background:
                  'linear-gradient(135deg, #F5C518, #C9A012)',
                color:
                  '#0A0F1E',
                fontWeight: 800,
                fontSize:
                  '16px',
                padding:
                  '16px',
                borderRadius:
                  '12px',
                border: 'none',
                cursor:
                  isPaying ||
                  slotsRemaining <= 0
                    ? 'not-allowed'
                    : 'pointer',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                gap: '8px',
                transition:
                  'opacity 0.2s',
                opacity:
                  isPaying ||
                  slotsRemaining <= 0
                    ? 0.7
                    : 1,
              }}
              onMouseEnter={(e) => {
                if (
                  !isPaying &&
                  slotsRemaining > 0
                ) {
                  e.currentTarget.style.opacity =
                    '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (
                  !isPaying &&
                  slotsRemaining > 0
                ) {
                  e.currentTarget.style.opacity =
                    '1';
                }
              }}
            >
              <Zap
                size={18}
                fill="currentColor"
              />

              {isPaying
                ? 'Processing...'
                : slotsRemaining <= 0
                  ? 'Draw Full'
                  : `Buy ${quantity} ${
                      quantity === 1
                        ? 'Entry'
                        : 'Entries'
                    } — ₹${total}`}
            </button>

            <p
              style={{
                color:
                  '#4A5A7A',
                fontSize:
                  '12px',
                textAlign:
                  'center',
                marginTop:
                  '12px',
              }}
            >
              <Shield
                size={11}
                style={{
                  display:
                    'inline',
                  marginRight:
                    '4px',
                }}
              />

              Secured by Razorpay ·
              Instant entry
              confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}