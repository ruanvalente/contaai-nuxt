# Plano de Ação – Migração da rota `dashboard` para `discover`

Implemente a seguinte refatoração na estrutura de rotas da aplicação, seguindo boas práticas de organização, componentização e manutenção do projeto.

## Objetivo

A rota `dashboard` deixará de ser a página principal da aplicação. A partir desta implementação, a rota principal será `discover`, tornando-se o ponto de entrada do usuário após a autenticação.

---

## 1. Migração da rota principal

* A rota `dashboard` deverá ser substituída por `discover`.
* Após o login, o usuário deverá ser redirecionado automaticamente para `/discover`.
* Toda referência existente para `/dashboard` deverá ser atualizada para `/discover`, evitando links quebrados ou navegação inconsistente.

---

## 2. Migração das sub-rotas

Atualmente a rota `dashboard` possui as seguintes sub-rotas:

* `explore`
* `my-session`

Essas rotas deverão ser movidas para dentro de `discover`, resultando em uma estrutura semelhante a:

```text
/discover
/discover/explore
/discover/my-session
```

Atualize toda a navegação da aplicação para utilizar os novos caminhos.

---

## 3. Ações Rápidas

Na tela principal do antigo `dashboard` existe um componente chamado **Ações Rápidas**, contendo os seguintes atalhos:

* Novo Livro
* Explorar
* Minha Sessão
* Estatísticas

Esse componente deverá ser mantido e exibido na página inicial de `discover`.

Todos os botões devem apontar para as novas rotas correspondentes.

---

## 4. Estrutura da Sidebar

Todos os itens presentes na sidebar deverão passar a ser sub-rotas de `discover`.

Estrutura esperada:

```text
/discover
├── explore
├── my-session
├── categories
├── library
├── downloads
├── favorites
```

Os seguintes itens deverão estar disponíveis na navegação:

* Categorias
* Minha Biblioteca
* Downloads
* Favoritos

Caso existam referências para essas páginas fora da estrutura de `discover`, atualize-as para a nova organização.

---

## 5. Header da página Discover

Atualize o header da página principal de `discover` para conter:

* Nome do usuário autenticado.
* Avatar (caso exista).
* Menu dropdown contendo:

  * Configurações da conta.
  * Logout.

O logout deverá reutilizar o fluxo de autenticação já existente na aplicação.

---

## 6. Rotas ainda não implementadas

As páginas abaixo ainda não possuem conteúdo funcional:

* Categorias
* Minha Biblioteca
* Downloads
* Favoritos
* Configurações

Para cada uma delas:

* Criar a rota.
* Criar a página correspondente.
* Exibir apenas um layout simples contendo:

  * título da página;
  * uma breve descrição como:

> "Esta funcionalidade será implementada em breve."

Essas páginas devem utilizar o mesmo layout padrão da aplicação para facilitar futuras implementações.

---

## 7. Boas práticas

Durante a implementação:

* Não alterar funcionalidades existentes que não estejam relacionadas a esta migração.
* Manter a tipagem em TypeScript.
* Reutilizar componentes existentes sempre que possível.
* Evitar duplicação de código.
* Atualizar menus, breadcrumbs, links e navegação para refletirem a nova estrutura.
* Garantir que o sistema continue responsivo.
* Preservar o estado da aplicação e o fluxo de autenticação.
* Remover referências obsoletas à rota `dashboard`, caso não sejam mais utilizadas.

---

## Resultado esperado

Ao final da implementação:

* O login direciona o usuário para `/discover`.
* A página `discover` torna-se a nova home autenticada da aplicação.
* O componente **Ações Rápidas** continua funcionando normalmente.
* Todas as páginas da sidebar passam a fazer parte da estrutura de `discover`.
* O header apresenta corretamente o usuário autenticado e o menu de perfil.
* As rotas ainda não implementadas já estão preparadas com páginas placeholder para futuras funcionalidades.
* Toda a navegação da aplicação permanece consistente e sem links quebrados.
