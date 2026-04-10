import { describe, expect, it } from 'vitest'

import {
  buildListingSearchParams,
  EMPTY_LISTING_FILTERS,
  hasListingSearchIntent,
  listingSnapshotsEqual,
  parseListingSearchParams,
} from './listing-search-params'

describe('listing-search-params', () => {
  it('parseListingSearchParams valida categoria, marca, ordenação, condição e q', () => {
    const sp = new URLSearchParams(
      'category=feminino&brand=marca-x&sort=price-desc&condition=usado&q=camisa',
    )
    const parsed = parseListingSearchParams(sp)
    expect(parsed).toEqual({
      category: 'feminino',
      brandSlug: 'marca-x',
      sort: 'price-desc',
      condition: 'usado',
      query: 'camisa',
    })
  })

  it('ignora valores inválidos e usa padrões', () => {
    const sp = new URLSearchParams('category=invalid&sort=wrong&condition=foo')
    const parsed = parseListingSearchParams(sp)
    expect(parsed.category).toBe('')
    expect(parsed.sort).toBe('name-asc')
    expect(parsed.condition).toBe('')
  })

  it('buildListingSearchParams omite padrões', () => {
    const params = buildListingSearchParams({
      ...EMPTY_LISTING_FILTERS,
      category: 'masculino',
    })
    expect(params.toString()).toBe('category=masculino')
  })

  it('buildListingSearchParams inclui q e condition quando definidos', () => {
    const params = buildListingSearchParams({
      ...EMPTY_LISTING_FILTERS,
      condition: 'novo',
      query: '  bermuda  ',
    })
    expect(params.get('condition')).toBe('novo')
    expect(params.get('q')).toBe('bermuda')
  })

  it('hasListingSearchIntent', () => {
    expect(hasListingSearchIntent(new URLSearchParams())).toBe(false)
    expect(hasListingSearchIntent(new URLSearchParams('category=masculino'))).toBe(true)
    expect(hasListingSearchIntent(new URLSearchParams('sort=name-asc'))).toBe(true)
    expect(hasListingSearchIntent(new URLSearchParams('q=foo'))).toBe(true)
    expect(hasListingSearchIntent(new URLSearchParams('condition=novo'))).toBe(true)
  })

  it('listingSnapshotsEqual', () => {
    expect(
      listingSnapshotsEqual(EMPTY_LISTING_FILTERS, {
        ...EMPTY_LISTING_FILTERS,
      }),
    ).toBe(true)
    expect(
      listingSnapshotsEqual(EMPTY_LISTING_FILTERS, { ...EMPTY_LISTING_FILTERS, sort: 'price-asc' }),
    ).toBe(false)
  })
})
