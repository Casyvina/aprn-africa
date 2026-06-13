import { StructureBuilder } from 'sanity/structure'
import {
  CogIcon,
  DocumentIcon,
  EarthGlobeIcon,
  BookIcon,
  UsersIcon,
  TagIcon,
  HomeIcon,
  BellIcon,
  ComponentIcon,
  EditIcon,
  EnvelopeIcon,
  CalendarIcon,
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('APRN Africa')
    .items([

      // ── Site Configuration ─────────────────────────────────────────
      S.listItem()
        .title('Site Configuration')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Configuration')
            .items([
              S.listItem()
                .title('Site Settings')
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Homepage Config')
                .icon(HomeIcon)
                .child(
                  S.document()
                    .schemaType('homepageConfig')
                    .documentId('homepageConfig')
                ),
            ])
        ),

      S.divider(),

      // ── Research & Intelligence ────────────────────────────────────
      S.listItem()
        .title('Research & Intelligence')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Research & Intelligence')
            .items([
              S.documentTypeListItem('researchReport')
                .title('Research Reports')
                .icon(DocumentIcon),
              S.documentTypeListItem('policyFramework')
                .title('Policy Frameworks')
                .icon(BookIcon),
              S.documentTypeListItem('publication')
                .title('Publications')
                .icon(EditIcon),
              S.documentTypeListItem('intelligenceUpdate')
                .title('Intelligence Updates')
                .icon(BellIcon),
              S.documentTypeListItem('editorialInsight')
                .title('Editorial Insights')
                .icon(EditIcon),
            ])
        ),

      // ── Newsletter ────────────────────────────────────────────────
      S.listItem()
        .title('Newsletter')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Newsletter')
            .items([
              S.documentTypeListItem('newsletter')
                .title('Issues')
                .icon(EnvelopeIcon),
              S.documentTypeListItem('subscriber')
                .title('Subscribers')
                .icon(UsersIcon),
            ])
        ),

      // ── Infrastructure ────────────────────────────────────────────
      S.listItem()
        .title('Infrastructure')
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title('Infrastructure')
            .items([
              S.documentTypeListItem('pipelineCorridor')
                .title('Pipeline Corridors')
                .icon(EarthGlobeIcon),
              S.documentTypeListItem('infrastructureProject')
                .title('Projects')
                .icon(ComponentIcon),
              S.documentTypeListItem('country')
                .title('Countries')
                .icon(EarthGlobeIcon),
            ])
        ),

      // ── Events ────────────────────────────────────────────────────
      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.documentTypeList('event')
            .title('Events')
        ),

      // ── Training ──────────────────────────────────────────────────
      S.listItem()
        .title('Training Programs')
        .icon(BookIcon)
        .child(
          S.documentTypeList('trainingProgram')
            .title('Training Programs')
        ),

      // ── Organization ──────────────────────────────────────────────
      S.listItem()
        .title('Organization')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Organization')
            .items([
              S.documentTypeListItem('organizationPartner')
                .title('Partners')
                .icon(UsersIcon),
              S.documentTypeListItem('person')
                .title('People')
                .icon(UsersIcon),
            ])
        ),

      S.divider(),

      // ── Taxonomy ──────────────────────────────────────────────────
      S.listItem()
        .title('Topics & Taxonomy')
        .icon(TagIcon)
        .child(
          S.documentTypeList('topic')
            .title('Topics & Tags')
        ),
    ])
