// ── Objects (no document dependencies) ──────────────────────────────
import { seoFields }         from './objects/seoFields'
import { capexFigure }       from './objects/capexFigure'
import { capacitySpec }      from './objects/capacitySpec'
import { citationMetadata }  from './objects/citationMetadata'
import { richText }          from './objects/richText'
import { geolocation }       from './objects/geolocation'
import { insightStat }       from './objects/insightStat'
import { newsletterStory }   from './objects/newsletterStory'

// ── Reference Entities (no cross-references) ─────────────────────────
import { country }           from './documents/infrastructure/country'
import { topic }             from './documents/editorial/topic'

// ── People & Organizations ───────────────────────────────────────────
import { person }                from './documents/organization/person'
import { organizationPartner }   from './documents/organization/organizationPartner'

// ── Infrastructure ───────────────────────────────────────────────────
import { pipelineCorridor }      from './documents/infrastructure/pipelineCorridor'
import { infrastructureProject } from './documents/infrastructure/infrastructureProject'

// ── Research ─────────────────────────────────────────────────────────
import { policyFramework }   from './documents/research/policyFramework'
import { publication }       from './documents/research/publication'
import { researchReport }    from './documents/research/researchReport'

// ── Training ─────────────────────────────────────────────────────────
import { trainingProgram }   from './documents/training/trainingProgram'

// ── Editorial ────────────────────────────────────────────────────────
import { intelligenceUpdate } from './documents/editorial/intelligenceUpdate'
import { editorialInsight }   from './documents/editorial/editorialInsight'
import { newsletter }         from './documents/editorial/newsletter'
import { subscriber }         from './documents/editorial/subscriber'

// ── Singletons ───────────────────────────────────────────────────────
import { siteSettings }      from './singletons/siteSettings'
import { homepageConfig }    from './singletons/homepageConfig'

export const schemaTypes = [
  // Objects first — they have no dependencies
  seoFields,
  capexFigure,
  capacitySpec,
  citationMetadata,
  richText,
  geolocation,
  insightStat,
  newsletterStory,

  // Atomic reference entities
  country,
  topic,

  // People & orgs
  person,
  organizationPartner,

  // Infrastructure (depends on country, organizationPartner)
  pipelineCorridor,
  infrastructureProject,

  // Research (depends on person, country, topic, infrastructure)
  policyFramework,
  publication,
  researchReport,

  // Training
  trainingProgram,

  // Editorial
  intelligenceUpdate,
  editorialInsight,
  newsletter,
  subscriber,

  // Singletons
  siteSettings,
  homepageConfig,
]
