# Descrição

Cria automaticamente um Pull Request completo e padronizado, com:

- Branch criada a partir da `master`
- Título semântico
- Descrição estruturada
- Checklist de testes
- Issues relacionadas

### IMPORTANTE:

> O conteúdo do PR (título + descrição) deve ser sempre em inglês.
> A branch de origem será criada automaticamente a partir da `master`.
> O PR sempre terá como destino a branch `master`.

### Como Usar

```bash
/pull-request-create <branch-name>
```

Exemplo

```bash
/pull-request-create feat/user-role-system
```

## Fluxo do Agente

### 1. Criar branch a partir da master

```bash
git checkout master
git pull origin master
git checkout -b <branch-name> master
```

### 2. Analisar mudanças

Identificar tipo:

- feat / fix / refactor / docs / chore / etc

Identificar escopo:

- dashboard, auth, books, ui, api, database, config

### 3. Gerar título semântico

Formato:

```bash
<type>(<scope>): <description>
```

### 4. Gerar descrição do PR (em inglês)

## Summary

...

## Changes

- ...

## Tests

- [ ] Unit tests passing
- [ ] Manual testing completed
- [ ] No console errors

## Related Issues

Closes #...

### 5. Publicar branch e criar PR

```bash
git push -u origin <branch-name>
gh pr create --base master --head <branch-name> --title "<title>" --body "<body>"
```

## Output

PR criado **link** do PullRequest no github.

## Title

Sempre em inglês e descritivo a mudança realizada:

Ex: feat / fix / refactor / docs / chore / etc

## Description

Ser extremamente descritivo e objetivo na sua descrição também em inglês.

## Regras

- Não escrever PR em português
- Não gerar título genérico
- Usar padrão semântico
- Ser claro e objetivo
- Branch sempre criada a partir da `master`
- PR sempre aponta para `master`
