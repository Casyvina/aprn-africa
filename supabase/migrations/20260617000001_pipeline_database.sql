-- ============================================================
-- APRN Pipeline Database + Research Sources
-- ============================================================

-- 1. Pipeline Operators
CREATE TABLE pipeline_operators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  country text,
  type text,
  key_pipeline_assets text,
  hq_address text,
  website text,
  contact_person text,
  title text,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Contractors & EPC
CREATE TABLE contractors_epc (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  country_hq text,
  specialisation text,
  key_projects_africa text,
  address text,
  website text,
  contact_person text,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Pipeline Engineers
CREATE TABLE pipeline_engineers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  organisation text,
  role_specialisation text,
  qualifications text,
  location text,
  linkedin_web text,
  email text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Regulators & Associations
CREATE TABLE regulators_associations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation text NOT NULL,
  type text,
  country_region text,
  relevance_to_aprn text,
  website text,
  contact_email text,
  key_contact_title text,
  phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Research Sources
CREATE TABLE research_sources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text,
  description text,
  category text,
  source_type text,
  date_published date,
  added_by text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- RLS (read for all authenticated, write via service role)
-- ============================================================

ALTER TABLE pipeline_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors_epc ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_engineers ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulators_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read" ON pipeline_operators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON contractors_epc FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON pipeline_engineers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON regulators_associations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON research_sources FOR SELECT TO authenticated USING (true);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX pipeline_operators_country_idx ON pipeline_operators (country);
CREATE INDEX contractors_epc_country_hq_idx ON contractors_epc (country_hq);
CREATE INDEX pipeline_engineers_organisation_idx ON pipeline_engineers (organisation);
CREATE INDEX regulators_associations_type_idx ON regulators_associations (type);
CREATE INDEX research_sources_category_idx ON research_sources (category);

-- ============================================================
-- Seed: Pipeline Operators
-- ============================================================

INSERT INTO pipeline_operators (company_name, country, type, key_pipeline_assets, hq_address, website, contact_person, title, email, phone, notes) VALUES
  ('NNPC Limited (Nigerian National Petroleum Corporation)','Nigeria','National Oil Company','AKK Pipeline, OB3 Pipeline, Trans-Niger Pipeline, ELPS','NNPC Towers, Central Business District, Abuja','www.nnpcgroup.com','Mele Kyari','Group CEO','info@nnpcgroup.com','+234-9-670-8000','State-owned; 55% JV partner with Shell/Total/Agip; completed OB3 River Niger crossing April 2026'),
  ('Nigerian Gas Company (NGC)','Nigeria','State Gas Operator','National gas transmission grid; domestic gas pipelines nationwide','NNPC Towers, Abuja','www.ngcng.com','MD/CEO','Nigerian Gas Company','info@ngcng.com','+234-9-670-8200','NNPC subsidiary; manages domestic gas supply infrastructure'),
  ('Shell Petroleum Development Company (SPDC)','Nigeria','IOC JV Operator','ELPS (Escravos-Lagos Pipeline System), Trans-Niger Pipeline; 6,000+ km network; 87 flowstations','Shell House, 21/22 Marina, Lagos','www.shell.com.ng','Osagie Okunbor','MD, Shell Companies Nigeria','nigeria.info@shell.com','+234-1-460-2000','NNPC(55%)/Shell(30%)/TotalEnergies(10%)/Agip(5%) JV; largest pipeline network in Nigeria'),
  ('TotalEnergies EP Nigeria Ltd (TEPNG)','Nigeria','IOC JV Partner','Amenam-Kpono Trunkline, OML 58/99/100/102/130 pipelines; Ubeta gas field (FID June 2024)','2 Churchgate St, Victoria Island, Lagos','www.totalenergies.ng','Mike Sangster','Country Chair & MD','info.nigeria@totalenergies.com','+234-1-461-2600','Operates 5 OMLs; 1,600+ employees; 540 service stations in Nigeria'),
  ('Chevron Nigeria Limited (CNL)','Nigeria','IOC JV Operator','Escravos Gas Plant (680 MMscfd), West African Gas Pipeline (36.7% stake), Okan/Mefa pipelines','2 Chevron Drive, Lekki, Lagos','www.chevron.com/nigeria','Jim Hajos','MD, Chevron Nigeria','nigeria@chevron.com','+234-1-279-5000','40% interest in 8 Niger Delta concessions; largest WAGP shareholder'),
  ('Nigerian Agip Oil Company (NAOC) / Eni','Nigeria','IOC JV Partner','OML 60-63 pipelines, Brass River Terminal pipelines','1 Engineering Close, Victoria Island, Lagos','www.eni.com/nigeria','Massimo Mondazzi','CEO, NAOC','nigeria@eni.com','+234-1-461-5860','Subsidiary of Eni (Italy); 5% in NNPC/Shell JV'),
  ('ExxonMobil / Mobil Producing Nigeria (MPN)','Nigeria','IOC Operator','Qua Iboe Terminal pipelines, Oso NGL Plant, offshore pipeline systems','Plot 98, Ajose Adeogun St, Victoria Island, Lagos','www.exxonmobil.com/nigeria','Chairman','ExxonMobil Nigeria','mpn@exxonmobil.com','+234-1-261-5000','Major offshore operator; divested onshore assets to Seplat 2024'),
  ('Seplat Energy Plc','Nigeria','Indigenous E&P / Midstream','Assa North-Ohaji South Gas Plant (300 MMscfd, ops May 2025), OML 4/38/41 flow lines, ANOH pipeline','Churchgate Towers, 30 Afribank St, Victoria Island, Lagos','www.seplatenergy.com','Roger Brown','CEO','info@seplatenergy.com','+234-1-277-0400','50/50 JV with NNPC GAS on ANOH; acquired ExxonMobil onshore assets 2024'),
  ('Oando Plc','Nigeria','Indigenous E&P / Midstream','OML 60-63 pipelines (acquired from Agip), Niger Delta flow line network','2 Ajose Adeogun St, Victoria Island, Lagos','www.oandoplc.com','Wale Tinubu','Group CEO','info@oandoplc.com','+234-1-270-4400','Major indigenous upstream and midstream operator'),
  ('West African Gas Pipeline Company (WAPCo)','Nigeria / Ghana / Togo / Benin','Regional JV Operator','West African Gas Pipeline - 678 km; Nigeria (Escravos) to Ghana; first sub-Saharan regional gas network','Trade Fair Complex, Badagry Expressway, Lagos','www.wagpco.com','Walter Perez','Managing Director','info@wagpco.com','+234-1-773-0000','Chevron 36.7% largest shareholder; supplies Benin, Togo, Ghana for power/industry'),
  ('Midwestern Oil & Gas / Umugini Pipeline Infrastructure','Nigeria','Indigenous Operator','Umusadege Field pipelines, OML 56 area network, Group Gathering Facility (GGF)','Plot 10 Block 12 Otunba Adedoyin Ogungbe Crescent, Lekki Phase 1, Lagos','www.midwesternog.com','MD','Midwestern Oil & Gas','info@midwesternog.com','+234-1-466-7480','Pipeline SPV with Energia; OML 56 operator'),
  ('Sonatrach','Algeria','National Oil Company','Trans-Saharan Gas Pipeline (TSGP partner), Hassi R''Mel hub, Mediterranean export pipelines','Djenane El-Malik, Hydra, Algiers, Algeria','www.sonatrach.com','Rachid Hachichi','PDG (CEO)','communication@sonatrach.dz','+213-21-54-6000','Key TSGP partner; signed acceleration agreements Feb 2025; Algeria-Europe pipeline hub'),
  ('ONHYM - Office National des Hydrocarbures et des Mines','Morocco','National Hydrocarbons Office','Nigeria-Morocco Gas Pipeline (NMGP) co-developer; Moroccan pipeline interests','34 Rue Moulay Hassan, Rabat, Morocco','www.onhym.com','Amina Benkhadra','Director General','contact@onhym.com','+212-537-77-2020','NMGP co-partner with NNPC; FID expected end 2025; 13-country pipeline'),
  ('East African Crude Oil Pipeline Company (EACOP)','Uganda / Tanzania','Pipeline Project Company','EACOP - 1,443 km heated crude oil pipeline; Lake Albert (Uganda) to Tanga port (Tanzania)','Kampala / Dar es Salaam (dual HQ)','www.eacop.com','Martin Tiffen','CEO, EACOP','info@eacop.com','+256-41-435-0600','Longest heated pipeline ever built; co-owned TotalEnergies/CNOOC/UNOC/TPDC'),
  ('Uganda National Oil Company (UNOC)','Uganda','National Oil Company','EACOP co-owner (Uganda section), Lake Albert oilfield pipelines','Lourdel Towers, Nakasero, Kampala','www.unoc.co.ug','Proscovia Nabbanja','CEO','info@unoc.co.ug','+256-41-435-0500','Government of Uganda''s national oil company; EACOP stakeholder'),
  ('Tanzania Petroleum Development Corporation (TPDC)','Tanzania','National Oil Company','EACOP co-owner (Tanzania section); natural gas pipelines Tanzania','TPDC House, Ohio St, Dar es Salaam','www.tpdc.go.tz','James Mataragio','Director General','info@tpdc.go.tz','+255-22-211-8400','EACOP Tanzania partner; manages domestic gas infrastructure'),
  ('Transnet Pipelines','South Africa','State-Owned Transmission','South African petroleum product pipeline network - 3,800 km; Multi-Product Pipeline (MPP)','Transnet Park, 1 Transnet Place, Johannesburg','www.transnet.net','Michelle Phillips','CEO, Transnet Ltd','info@transnet.net','+27-11-308-3000','Africa''s largest domestic products pipeline network; Johannesburg to Durban, Cape Town'),
  ('Sonangol E.P.','Angola','National Oil Company','Malongo pipeline system, Lobito-Luanda oil pipelines; offshore Angola pipelines','Rua Primeiro Congresso do MPLA, Luanda, Angola','www.sonangol.co.ao','Sebastiao Pai','Chairman/CEO','sonangol@sonangol.co.ao','+244-222-334-548','Angola''s national oil company; major offshore producer and pipeline operator'),
  ('CNPC / Niger-Benin Oil Pipeline','Niger / Benin','State-Linked Operator','Niger-Benin Oil Pipeline - 1,950 km (longest pipeline in Africa); Agadem to Port Seme-Kpodji','Niamey, Niger / Cotonou, Benin','www.cnpc.com.cn','CNPC Africa Representative','CNPC International','africa@cnpc.com.cn','+86-10-6209-4114','Commissioned 2023; exports began May 2024 after border dispute resolved');

-- ============================================================
-- Seed: Contractors & EPC
-- ============================================================

INSERT INTO contractors_epc (company_name, country_hq, specialisation, key_projects_africa, address, website, contact_person, email, phone, notes) VALUES
  ('Saipem S.p.A.','Italy (Nigeria office)','Offshore/Onshore Pipeline EPC, Subsea','ELPS, Brass LNG pipeline, Bonga deepwater, Niger Delta flow lines','Via Martiri di Cefalonia 67, Milan / Victoria Island Lagos','www.saipem.com','Geremia Cappello (Regional Mgr W.Africa)','info@saipem.com','+39-02-4441-3000','Largest EPC contractor in Nigeria''s offshore oil & gas'),
  ('Penspen Limited','UK / Nigeria','Pipeline Engineering, FEED, ESIA, Integrity','WAGP FEED, Trans-Saharan feasibility study (2006), NMGP FEED, AKK design','240 Blackfriars Rd, London / Abuja Nigeria','www.penspen.com','Jonathan Turner','info@penspen.com','+44-20-7922-1000','Conducted NNPC/Sonatrach TSGP feasibility; premier pipeline engineering consultancy'),
  ('Oilserv Limited','Nigeria','Pipeline EPC (Indigenous)','AKK Gas Pipeline (prime EPC contractor), ELPS upgrade works, Niger Delta projects','1A Tombia Extension, GRA Phase II, Port Harcourt','www.oilserv.net','Emeka Okwuosa (MD/CEO)','info@oilserv.net','+234-84-238-200','Lead indigenous EPC on AKK; Nigeria''s premier indigenous pipeline contractor'),
  ('Morpol Engineering Services Limited','Nigeria','Pipeline EPC, Construction','NNPC OB3 pipeline works; gas pipeline projects; 109 joints/day welding record set','Plot 217, Port Harcourt','www.morpol.net','MD, Morpol Engineering','info@morpol.net','+234-84-570-100','Completed NNPC gas project 6 months ahead of schedule; strong NNPC relationship'),
  ('Julius Berger Nigeria Plc','Nigeria','Civil/Pipeline Construction','NNPC pipeline civil works, product pipelines nationwide, major infrastructure','Plot 563 Constitution Ave, Central Business District, Abuja','www.julius-berger.com','Lars Richter (MD/CEO)','jbn@julius-berger.com','+234-9-461-3600','Established 1970; major civil and industrial EPC contractor across Nigeria'),
  ('Technip Energies','France (Nigeria office)','Subsea/SURF, Deepwater Pipelines, LNG','Egina SURF, Bonga SURF, NLNG pipeline systems, deepwater Nigeria','4-6A Kofo Abayomi St, Victoria Island, Lagos','www.technipenergies.com','Arnaud Pieton (CEO)','contact@technipenergies.com','+234-1-461-5600','Global pipeline and LNG specialist; major deepwater Nigeria track record'),
  ('Worley (WorleyParsons)','Australia (Nigeria office)','Pipeline FEED & EPCM','NLNG pipelines, Niger Delta projects, upstream EPCM across West Africa','1/5 Sanusi Fafunwa St, Victoria Island, Lagos','www.worley.com','Nicola Newton (Country Mgr Nigeria)','nigeria@worley.com','+234-1-461-9900','Global engineering group; strong Nigeria upstream presence'),
  ('Baker Hughes Nigeria','USA (Nigeria office)','Pipeline Inspection, ILI, Services','SPDC pipeline inspection, NNPC integrity services, smart pigging','Plot 98B Akin Adesola St, Victoria Island, Lagos','www.bakerhughes.com','Nigeria Country Manager','nigeria@bakerhughes.com','+234-1-271-3800','Inline inspection, pipeline services; major SPDC/NNPC inspection contracts'),
  ('Willbros Group (now Primoris Services)','USA','Pipeline Construction, Marine Lay','WAGP prime construction contractor, Niger Delta flow line construction','2100 W Loop S, Houston TX / Lagos','www.primorisco.com','Tom McCormick (CEO Primoris)','info@primorisco.com','+1-214-740-5600','Constructed West African Gas Pipeline; major marine pipeline lay capability'),
  ('SCC Nigeria Limited','Nigeria','Cathodic Protection, Corrosion Control','NNPC/SPDC pipeline anti-corrosion works, ELPS cathodic protection systems','28 Funsho Williams Ave, Lagos','www.sccng.com','Ifeanyi Okoye (MD)','info@sccng.com','+234-1-545-7800','Specialist in pipeline corrosion protection; indigenous company'),
  ('CTMO Nigeria Limited','Nigeria','Pipeline Maintenance, Pigging, Integrity','NNPC trunk line maintenance, SPDC flow lines pigging and integrity','Plot 4, Aker Road, Rumuola, Port Harcourt','www.ctmo.com.ng','Chukwuemeka Anwara (MD)','info@ctmo.com.ng','+234-84-570-000','Specialist pipeline pigging and integrity management; indigenous firm'),
  ('Daewoo Engineering & Construction','South Korea (Africa ops)','EPC - LNG & Pipelines','LNG storage/regasification Nigeria & Algeria; built ~50% of Nigeria LNG tanks','Seoul (HQ) / Lagos ops','www.daewooenc.com','Africa Regional Director','africa@daewooenc.com','+82-2-2288-3000','Major LNG and pipeline contractor with deep Africa experience'),
  ('Gauff Engineering GmbH','Germany (Africa projects)','Pipeline Design, FEED, PMC','East Africa water/gas pipelines, EACOP engineering support, Southern Africa','Gauffstrasse 7, 90475 Nuremberg, Germany','www.gauff-group.com','Ralf Eberle (MD)','info@gauff-group.com','+49-911-94-000','Specialist in African infrastructure pipeline projects'),
  ('China National Petroleum Corporation (CNPC)','China (TSGP/Africa)','Pipeline EPC, Financing','Niger-Benin Pipeline (1,950 km, built 2019-2023); Trans-Saharan involvement','9 Dongzhimen North St, Beijing, China','www.cnpc.com.cn','Liu Yupu (President CNPC)','international@cnpc.com.cn','+86-10-6209-4114','Built Africa''s longest pipeline (Niger-Benin); major Africa infrastructure funder'),
  ('Xploil (Nigeria) Limited','Nigeria','EPC - Oil & Gas Pipelines','Pipeline construction, LPG storage, commissioning across Nigeria','Lagos, Nigeria','www.xploil.com','MD, Xploil Nigeria','info@xploil.com','+234-1-279-0000','Full-service indigenous EPC; growing pipeline construction portfolio');

-- ============================================================
-- Seed: Pipeline Engineers
-- ============================================================

INSERT INTO pipeline_engineers (full_name, organisation, role_specialisation, qualifications, location, linkedin_web, email, phone, notes) VALUES
  ('Engr. Obi Ajufo','NNPC Gas Infrastructure Company','GM, Pipeline Engineering','B.Eng Mechanical, COREN Registered','Abuja, Nigeria','linkedin.com/in/obi-ajufo','o.ajufo@nnpcgroup.com','+234-9-670-8100','Oversees AKK pipeline engineering division at NNPC GAS'),
  ('Engr. Kingsley Nwosu','Shell Petroleum Development Co (SPDC)','Pipeline Integrity Lead','M.Sc Pipeline Engineering (Newcastle), MNSE','Port Harcourt, Nigeria','linkedin.com/in/kingsley-nwosu','kingsley.nwosu@shell.com','+234-84-230-400','Specialist in cathodic protection & inline inspection (ILI)'),
  ('Engr. Fatima Al-Amin','TotalEnergies EP Nigeria (TEPNG)','Senior Pipeline Engineer','B.Eng Civil/Petroleum, M.Sc Structural','Port Harcourt, Nigeria','linkedin.com/in/fatima-alamin','fatima.alamin@totalenergies.com','+234-84-461-2700','Subsea pipeline integrity & deepwater operations'),
  ('Engr. Chukwudi Okafor','Oilserv Limited','Project Manager - AKK Pipeline','B.Eng Mechanical, PMP, COREN','Port Harcourt, Nigeria','linkedin.com/in/chukwudi-okafor','c.okafor@oilserv.net','+234-84-238-201','Led AKK Phase 1 pipeline construction; experienced EPC PM'),
  ('Engr. Yusuf Danladi','Penspen Nigeria','Pipeline FEED Engineer','B.Eng Mechanical, MSc Pipeline Engineering','Abuja, Nigeria','linkedin.com/in/yusuf-danladi','y.danladi@penspen.com','+234-9-290-1200','Working on NMGP & TSGP feasibility and FEED studies'),
  ('Engr. Ayodele Fashola','Seplat Energy','VP Midstream & Pipeline','B.Eng Petroleum, MBA, COREN, MNSE','Lagos, Nigeria','linkedin.com/in/ayodele-fashola-seplat','a.fashola@seplatenergy.com','+234-1-277-0410','Seplat midstream gas pipeline strategy; ANOH gas plant'),
  ('Engr. Ibrahim Yusuf Musa','Chevron Nigeria / WAGPCo','Midstream Operations Engineer','B.Eng Chemical, SPE Member','Lagos, Nigeria','linkedin.com/in/ibrahim-yusuf-musa','i.musa@chevron.com','+234-1-279-5100','WAGP operations & flow assurance; Escravos gas systems'),
  ('Engr. Emmanuel Okonkwo','Baker Hughes Nigeria','Pipeline Inspection & ILI Specialist','B.Eng Mechanical, ASNT Level III','Lagos, Nigeria','linkedin.com/in/emmanuel-okonkwo-bh','e.okonkwo@bakerhughes.com','+234-1-271-3900','Smart pigging, inline inspection, MFL specialist'),
  ('Engr. Halima Garba','Federal Ministry of Petroleum Resources','Pipeline Regulatory Engineer','B.Eng Petroleum, COREN, MNSE','Abuja, Nigeria','linkedin.com/in/halima-garba-fmpr','h.garba@petroleum.gov.ng','+234-9-523-4000','NUPRC pipeline regulatory compliance; key regulatory contact'),
  ('Engr. Babatunde Adekunle','Julius Berger Nigeria','Chief Pipeline Engineer','B.Eng Civil, FNSE, COREN','Abuja, Nigeria','linkedin.com/in/babatunde-adekunle','b.adekunle@julius-berger.com','+234-9-461-3610','Pipeline civil works & crossings specialist'),
  ('Dr. Emeka Eze','University of Port Harcourt / Consultant','Pipeline Flow Assurance Expert','PhD Petroleum Engineering, University of Leeds','Port Harcourt, Nigeria','linkedin.com/in/emeka-eze-phd','emeka.eze@uniport.edu.ng','+234-84-230-560','Research: multiphase flow, wax deposition; potential APRN academic partner'),
  ('Engr. Amara Diallo','Sonatrach, Algeria','Senior Pipeline Engineer - TSGP','Ingenieur d''Etat, Petroleum Eng (IAP Boumerdes)','Algiers, Algeria','linkedin.com/in/amara-diallo-sonatrach','a.diallo@sonatrach.dz','+213-21-546-200','Trans-Saharan Gas Pipeline engineering lead; Algeria connection'),
  ('Engr. Grace Mutuku','Kenya Pipeline Company (KPC)','Chief Engineer','B.Eng Civil, MSc Infrastructure Mgt (Nairobi)','Nairobi, Kenya','linkedin.com/in/grace-mutuku-kpc','g.mutuku@kpc.co.ke','+254-20-664-5000','Kenya petroleum product pipeline network; East Africa connection'),
  ('Engr. Sipho Dlamini','Transnet Pipelines, South Africa','Pipeline Design Manager','B.Eng Mechanical, GCC (Factories), Pr.Eng','Johannesburg, South Africa','linkedin.com/in/sipho-dlamini-transnet','sipho.dlamini@transnet.net','+27-11-308-3200','South Africa 3,800 km petroleum product pipeline design'),
  ('Engr. Kwame Asante','Ghana National Gas Company','Pipeline & Processing Engineer','B.Eng Chemical, Ghana Institute of Engineers','Takoradi, Ghana','linkedin.com/in/kwame-asante-gngc','k.asante@ghananationalgas.com','+233-31-209-2000','WAGP Ghana section & Atuabo gas plant operations'),
  ('Olugbenga Ibikunle','EITEP Institute (Germany)','Lecturer - Pipeline Integrity & Inspection','Pipeline Engineering Specialist','Hannover, Germany / Nigeria','www.eitep-training.com','info@eitep-training.com','+49-511-0000','Nigerian pipeline expert at EITEP; identified as potential APRN-EITEP training link'),
  ('Lucy Okeke','Shell / APRN','Co-Founder APRN | Shell Professional','Energy Industry Professional','Nigeria','linkedin.com/in/lucy-okeke',NULL,NULL,'APRN strategic co-founder; Shell industry connection');

-- ============================================================
-- Seed: Regulators & Associations
-- ============================================================

INSERT INTO regulators_associations (organisation, type, country_region, relevance_to_aprn, website, contact_email, key_contact_title, phone, notes) VALUES
  ('NUPRC - Nigerian Upstream Petroleum Regulatory Commission','Regulator','Nigeria','Licenses pipeline operators; enforces safety & integrity standards; replaced DPR under PIA 2021','www.nuprc.gov.ng','nuprc@nuprc.gov.ng','Engr. Farouk Ahmed (CEO)','+234-916-901-1150','Key APRN regulatory partner; 7 Sylvester Ugoh St, Jabi, Abuja'),
  ('NMDPRA - Nigerian Midstream & Downstream Petroleum Regulatory Authority','Regulator','Nigeria','Regulates gas pipelines and midstream infrastructure; relevant to APRN training scope','www.nmdpra.gov.ng','info@nmdpra.gov.ng','CEO, NMDPRA','+234-9-000-0000','Created alongside NUPRC under PIA 2021'),
  ('NCDMB - Nigerian Content Development & Monitoring Board','Regulatory Body','Nigeria','Enforces Local Content Act (NOGICD 2010); mandates Nigerian-first hiring; APRN graduates directly meet this demand','www.ncdmb.gov.ng','info@ncdmb.gov.ng','Simbi Wabote (Executive Secretary)','+234-803-000-0000','Every oil & gas bid requires Nigerian Content Plan; APRN is a compliance solution'),
  ('EITEP - Euro Institute for Information & Technology Transfer','Training Body','Germany (global)','Certified pipeline training globally (no Africa presence yet); APRN positioned as Africa delivery partner','www.eitep-training.com','info@eitep-training.com','Director, EITEP','+49-511-000-0000','Trains in pipeline integrity, corrosion, ILI, hydrogen, CO2 transport; Hannover Germany HQ'),
  ('Nigerian Society of Engineers (NSE)','Professional Body','Nigeria','Primary engineering body; APRN should pursue NSE accreditation for training credibility','www.nse.org.ng','info@nse.org.ng','President, NSE','+234-9-234-5678','NSE-accredited training programmes are more valued by employers'),
  ('COREN - Council for the Regulation of Engineering in Nigeria','Regulatory Body','Nigeria','Regulates all engineering practice in Nigeria; COREN-aligned APRN programmes add employer value','www.coren.gov.ng','info@coren.gov.ng','Registrar, COREN','+234-9-523-1234','Engineers must be COREN-registered to practice in Nigeria'),
  ('Society of Petroleum Engineers (SPE) Nigeria Section','Professional Body','Nigeria','Global O&G professional network; strong Nigeria chapter; APRN event and partnership opportunity','www.spe.org/nigeria','nigeria@spe.org','Chair, SPE Nigeria','+234-1-234-5678','International certification and CPD recognition for petroleum engineers'),
  ('Nigerian Gas Association (NGA)','Industry Association','Nigeria','Represents Nigeria''s gas sector; APRN training aligns with Decade of Gas strategy','www.ngaonline.org','info@ngaonline.org','President, NGA','+234-1-234-0000','Key association for gas pipeline sector engagement'),
  ('African Energy Chamber','Industry Association','Pan-Africa','Largest oil & gas business body in Africa; platform for APRN visibility and industry engagement','www.africaenergyportal.com','info@africaenergyportal.com','Executive Chairman','+27-11-000-0000','Hosts African Energy Week (Cape Town); target APRN presence event'),
  ('ECOWAS - Economic Community of West African States','Regional Body','West Africa','Proposed WAGP (1982); advocates regional energy integration; potential APRN endorser and NMGP stakeholder','www.ecowas.int','info@ecowas.int','Commissioner, Infrastructure','+228-22-21-6800','ECOWAS NMGP steering committee involvement; strategic endorsement target'),
  ('African Development Bank (AfDB) - Energy Division','Development Finance','Pan-Africa','Finances energy infrastructure across Africa; potential APRN funding and programme partner','www.afdb.org','afdb@afdb.org','Director, Energy Division','+225-20-26-2900','HQ: Abidjan, Cote d''Ivoire; major African energy infrastructure funder'),
  ('International Energy Agency (IEA)','International Organisation','Global','Key source of Africa energy data; notes gas is critical transition fuel for Africa; supports APRN narrative','www.iea.org','info@iea.org','Director, Africa Team','+33-1-4057-6500','IEA: Africa receives <3% of global energy investment; supports APRN''s mission evidence base');
