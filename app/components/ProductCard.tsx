'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import {
  Flame,
  Clock,
  Users,
} from 'lucide-react';

import {
  formatINR,
  getFillPercentage,
  getFillColor,
  getTimeRemaining,
  ENTRY_PRICE,
} from '../lib/data';

import type { StoredProduct } from '../lib/products-db';

type ProductCardProps = {
  product: StoredProduct;
  filled: number;
};

export default function ProductCard({
  product,
  filled,
}: ProductCardProps) {
  const pct = getFillPercentage(
    filled,
    product.totalSlots
  );

  const fillColor =
    getFillColor(pct);

  const [timeLeft, setTimeLeft] =
    useState<string | null>(null);

  useEffect(() => {
    setTimeLeft(
      getTimeRemaining(
        product.endsAt
      )
    );

    const t = setInterval(
      () =>
        setTimeLeft(
          getTimeRemaining(
            product.endsAt
          )
        ),
      30000
    );

    return () =>
      clearInterval(t);
  }, [product.endsAt]);

  const isUrgent = pct >= 90;

  const slotsLeft = Math.max(
    0,
    product.totalSlots - filled
  );

  return (
    <div
      style={{
        background: '#1E2A45',
        border: `1px solid ${
          isUrgent
            ? '#E8364F40'
            : '#2A3A5C'
        }`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition:
          'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          'translateY(-4px)';

        e.currentTarget.style.boxShadow =
          '0 20px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          'translateY(0)';

        e.currentTarget.style.boxShadow =
          'none';
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          background: '#0A1628',
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.9,
          }}
        />

        {/* Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '6px',
          }}
        >
          {product.isHot && (
            <span
              style={{
                background: '#E8364F',
                color: 'white',
                fontSize: '11px',
                fontWeight: 700,
                padding:
                  '3px 8px',
                borderRadius:
                  '20px',
                display: 'flex',
                alignItems:
                  'center',
                gap: '4px',
              }}
            >
              <Flame size={11} />
              HOT
            </span>
          )}

          <span
            style={{
              background:
                'rgba(10,15,30,0.85)',
              color: '#8A9BBE',
              fontSize: '11px',
              fontWeight: 600,
              padding:
                '3px 8px',
              borderRadius:
                '20px',
            }}
          >
            {product.category}
          </span>
        </div>

        {isUrgent && (
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              background:
                'linear-gradient(transparent, rgba(232,54,79,0.3))',
              height: '60px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '16px',
        }}
      >
        <div
          style={{
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              color: '#8A9BBE',
              fontSize: '11px',
              fontWeight: 600,
              textTransform:
                'uppercase',
              letterSpacing:
                '0.5px',
            }}
          >
            {product.brand}
          </span>
        </div>

        <h3
          style={{
            color: '#F0EDE6',
            fontSize: '15px',
            fontWeight: 700,
            marginBottom:
              '6px',
            lineHeight: '1.3',
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            color: '#8A9BBE',
            fontSize: '12px',
            lineHeight: '1.5',
            marginBottom:
              '14px',
          }}
        >
          {product.description}
        </p>

        {/* Value row */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            marginBottom:
              '12px',
          }}
        >
          <div>
            <div
              style={{
                color:
                  '#8A9BBE',
                fontSize:
                  '10px',
                fontWeight: 600,
                textTransform:
                  'uppercase',
                marginBottom:
                  '2px',
              }}
            >
              Product Value
            </div>

            <div
              className="gold-text"
              style={{
                fontSize:
                  '18px',
                fontWeight: 800,
              }}
            >
              {formatINR(
                product.value
              )}
            </div>
          </div>

          <div
            style={{
              textAlign:
                'right',
            }}
          >
            <div
              style={{
                color:
                  '#8A9BBE',
                fontSize:
                  '10px',
                fontWeight: 600,
                textTransform:
                  'uppercase',
                marginBottom:
                  '2px',
              }}
            >
              Entry Price
            </div>

            <div
              style={{
                color:
                  '#22C55E',
                fontSize:
                  '18px',
                fontWeight: 800,
              }}
            >
              ₹{ENTRY_PRICE}
            </div>
          </div>
        </div>

        {/* Fill bar */}
        <div
          style={{
            marginBottom:
              '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              marginBottom:
                '6px',
            }}
          >
            <span
              style={{
                color:
                  '#8A9BBE',
                fontSize:
                  '11px',
                display:
                  'flex',
                alignItems:
                  'center',
                gap: '4px',
              }}
            >
              <Users size={11} />

              {filled.toLocaleString(
                'en-IN'
              )}{' '}
              entries
            </span>

            <span
              style={{
                fontSize:
                  '11px',
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
              height: '8px',
              overflow:
                'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                background:
                  `linear-gradient(90deg, ${fillColor}99, ${fillColor})`,
                borderRadius:
                  '100px',
                transition:
                  'width 0.8s ease',
              }}
              className={
                pct >= 90
                  ? 'fill-bar-active'
                  : ''
              }
            />
          </div>

          <div
            style={{
              color:
                '#8A9BBE',
              fontSize:
                '10px',
              marginTop:
                '4px',
            }}
          >
            {slotsLeft.toLocaleString(
              'en-IN'
            )}{' '}
            slots remaining
          </div>
        </div>

        {/* Time & CTA */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems:
              'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: '4px',
              color: isUrgent
                ? '#E8364F'
                : '#8A9BBE',
              fontSize:
                '12px',
              fontWeight: 600,
              flex: 1,
            }}
          >
            <Clock size={13} />

            {timeLeft ?? '...'}
          </div>

          <Link
            href={`/products/${product.id}`}
            style={{
              background:
                'linear-gradient(135deg, #F5C518, #C9A012)',
              color:
                '#0A0F1E',
              fontSize:
                '13px',
              fontWeight: 800,
              padding:
                '8px 16px',
              borderRadius:
                '8px',
              textDecoration:
                'none',
              whiteSpace:
                'nowrap',
            }}
          >
            Enter ₹2
          </Link>
        </div>
      </div>
    </div>
  );
}