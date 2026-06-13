-- Add category column to strategy_documents_meta for document library filtering
ALTER TABLE strategy_documents_meta ADD COLUMN IF NOT EXISTS category text;
