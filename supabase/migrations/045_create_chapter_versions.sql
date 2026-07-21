-- ===============================================================
-- Migration: 045_create_chapter_versions.sql
-- Description: Tabela de versões de capítulos para histórico de alterações
-- ===============================================================

-- ---------------------------------------------------------------
-- Tabela chapter_versions (versões dos capítulos)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chapter_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES user_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  label TEXT,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Índices para performance
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_chapter_versions_chapter_id ON chapter_versions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_versions_document_id ON chapter_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_chapter_versions_user_id ON chapter_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_versions_chapter_created ON chapter_versions(chapter_id, created_at DESC);

-- ---------------------------------------------------------------
-- Trigger para updated_at não necessário (versões são imutáveis)
-- ---------------------------------------------------------------

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------
ALTER TABLE chapter_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem gerenciar suas próprias versões
DROP POLICY IF EXISTS "Users manage own chapter versions" ON chapter_versions;
CREATE POLICY "Users manage own chapter versions"
  ON chapter_versions FOR ALL
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- Comentários
-- ---------------------------------------------------------------
COMMENT ON TABLE chapter_versions IS 'Histórico de versões dos capítulos. Cada registro representa o estado do conteúdo em um momento específico.';
COMMENT ON COLUMN chapter_versions.chapter_id IS 'ID do capítulo ao qual esta versão pertence.';
COMMENT ON COLUMN chapter_versions.content IS 'Conteúdo do capítulo em formato ProseMirror JSON neste ponto no tempo.';
COMMENT ON COLUMN chapter_versions.label IS 'Rótulo opcional para a versão (ex: "Antes da reestruturação").';
