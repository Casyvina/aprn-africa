import { sanityFetch } from '@/lib/sanity/fetch'
import { FEATURED_PARTNERS_QUERY, type PartnerCard } from '@/lib/queries/partners'
import PartnershipsSectionClient from './PartnershipsSectionClient'

const FALLBACK_PARTNERS: PartnerCard[] = [
  { _id: 'f1', name: 'Nigerian National Petroleum Company Limited', slug: 'nnpcl',                    type: 'energy-company', tier: 'strategic',     featured: true  },
  { _id: 'f2', name: 'ECOWAS Energy Commission',                    slug: 'ecowas-energy-commission', type: 'regulatory',     tier: 'institutional', featured: true  },
  { _id: 'f3', name: 'African Development Bank',                    slug: 'african-development-bank', type: 'financial',      tier: 'institutional', featured: true  },
  { _id: 'f4', name: 'EITEP Institute',                             slug: 'eitep-institute',           type: 'academic',       tier: 'strategic',     featured: true  },
  { _id: 'f5', name: 'African Union Commission',                    slug: 'african-union-commission',  type: 'multilateral',   tier: 'institutional', featured: true  },
  { _id: 'f6', name: 'ONHYM Morocco',                               slug: 'onhym-morocco',             type: 'energy-company', tier: 'strategic',     featured: false },
]

export default async function PartnershipsSection() {
  let partners: PartnerCard[] = FALLBACK_PARTNERS

  try {
    const fetched = await sanityFetch<PartnerCard[]>(FEATURED_PARTNERS_QUERY, {}, ['organizationPartner'])
    if (fetched && fetched.length > 0) partners = fetched
  } catch {
    // use fallbacks
  }

  return <PartnershipsSectionClient partners={partners} />
}
