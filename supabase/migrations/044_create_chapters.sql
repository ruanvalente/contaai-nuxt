-- ===============================================================
-- Migration: 044_create_chapters.sql
-- Description: Tabela de capítulos para o editor de livros
-- ===============================================================

-- ---------------------------------------------------------------
-- Tabela chapters (capítulos dos livros do usuário)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES user_books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Novo Capítulo',
  content JSONB DEFAULT '{"type":"doc","content":[{"type":"paragraph","content":[]}]}'::jsonb,
  "order" INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Índices para performance
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_chapters_document_id ON chapters(document_id);
CREATE INDEX IF NOT EXISTS idx_chapters_user_id ON chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_document_order ON chapters(document_id, "order");

-- ---------------------------------------------------------------
-- Trigger para atualizar updated_at
-- ---------------------------------------------------------------
DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem gerenciar seus próprios capítulos
DROP POLICY IF EXISTS "Users manage own chapters" ON chapters;
CREATE POLICY "Users manage own chapters"
  ON chapters FOR ALL
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- Comentários
-- ---------------------------------------------------------------
COMMENT ON TABLE chapters IS 'Capítulos dos livros criados pelos usuários. Armazena o conteúdo em formato ProseMirror JSON.';
COMMENT ON COLUMN chapters.document_id IS 'ID do livro (user_books) ao qual o capítulo pertence.';
COMMENT ON COLUMN chapters.content IS 'Conteúdo do capítulo em formato ProseMirror JSON.';
COMMENT ON COLUMN chapters."order" IS 'Ordem do capítulo dentro do livro (0-indexed).';