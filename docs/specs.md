# Software Requirements Specification (SRS) — Violinha.com.br

---

## 1. Escopo e Visão Geral

O projeto consiste no desenvolvimento de um site institucional e catálogo digital para uma empresa familiar com 15 anos de tradição na produção de peixes empanados (IQF). O objetivo principal é servir como vitrine para a **Páscoa de 2026**, facilitando a localização física e o contato via WhatsApp para confirmação de estoque e atendimento, reduzindo atritos logísticos.

O site permanecerá no ar **ao longo do ano** — não é um projeto sazonal descartável. Fora do período da Quaresma/Páscoa, o catálogo reflete o que está disponível no momento, com gestão feita diretamente pelo proprietário via edição do `data.json`.

- **Pilar Principal:** Praticidade ("Do congelador para o óleo").
- **Público-alvo:** Consumidores finais (B2C) e clientes lancheiras/restaurantes recorrentes.
- **Diferencial Técnico:** Técnica IQF, empanamento artesanal em farinha de milho (sem glúten).
- **Deadline crítico:** Lançamento o quanto antes — a Sexta-feira Santa de 2026 é em **03 de abril de 2026** e o domínio precisa envelhecer. Faltam poucos dias.

---

## 2. Localização e Presença Local

- **Endereço:** Rua General Vargas, 31 — Bairro São Jorge — Novo Hamburgo / RS
- **Coordenadas:** `-29.674602, -51.102520`
- **Google Business Profile:** Existe, mas precisa ser atualizado (nome e domínio antigos). Atualização deve acompanhar o lançamento do novo site.
- **Estratégia:** Como é um negócio hiperlocal com ponto físico, o site deve ser **saturado de meta tags e dados estruturados** onde for tecnicamente viável. Não há volume alto de páginas, então o overhead é desprezível e o ganho de relevância local é máximo.

---

## 3. Requisitos Funcionais (RF)

### RF01 — Catálogo Dinâmico (SSR)
Exibição de produtos via Server-Side Rendering consumindo um arquivo `data.json`. Produtos com `"ativo": false` não são exibidos no catálogo, mas a rota deve retornar uma página de "produto indisponível" para reforçar o SEO. Podemos até cadastrar produtos sem estoque para já ir 'aquecendo' a respectiva página.

### RF01b — Layout da Homepage
A homepage exibe os produtos disponíveis (`"ativo": true`) em um **grid de 2 colunas de cards**, otimizado para mobile.

**Comportamento do card:** Ao tocar/clicar em um card, o usuário acessa os detalhes do produto. Há duas abordagens em aberto — **decisão necessária antes da implementação:**

| Opção | Prós | Contras |
|---|---|---|
| **A — Página completa** (`/peixe/slug`) | URL própria, indexável, compartilhável via WhatsApp/Stories com og:image | Navegação sai da home; mais templates para manter |
| **B — Modal** (overlay sobre a home) | Experiência fluida e rápida; sem troca de página | URL não muda → não indexável → o SEO da página de produto depende só da rota direta |
| **C — Híbrido** (modal + URL persistível via `history.pushState`) | Melhor dos dois mundos | Mais complexo de implementar corretamente |

> **Recomendação:** Opção **A** (página completa) para a v1. Garante SEO máximo com esforço mínimo. Modal pode ser adicionado como enhancement posterior sem quebrar rota.

### RF02 — Taxonomia Biológica
Organização visual dos produtos em duas categorias:
- Com barbatanas e escamas (Ex: Traíra).
- Peixes de couro (Ex: Violinha, Rosado/Bagre, Anjo).

### RF03 — Roteamento por Slug Manual
Cada produto deve ter sua própria URL amigável definida no JSON (Ex: `/peixe/violinha-empanada`).
**Decisão:** Uma única página por espécie/produto, com o seletor de gramagem dentro da página. Duas URLs para o mesmo peixe diluiria autoridade de página (SEO). A mensagem gerada para o WhatsApp já inclui a gramagem selecionada.

### RF04 — SEO Open Graph
Cada página de produto deve renderizar meta tags específicas para compartilhamento em redes sociais e WhatsApp:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, ...
- **Twitter Cards:** `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **Canonical URL:** Tag `<link rel="canonical">` em todas as páginas para evitar conteúdo duplicado (trailing slash, variações de acesso).

### RF04b — Dados Estruturados (Structured Data / JSON-LD)
Implementar Schema.org via JSON-LD em todas as páginas relevantes:

- **Homepage / global:** `LocalBusiness` (ou `FoodEstablishment`) com nome, endereço, coordenadas, telefone/WhatsApp, horário de plantão, imagem.
- **Páginas de produto:** `Product` com nome, descrição, imagem, preço, disponibilidade, alérgenos.
- **Exemplo `LocalBusiness`:**
```json
{
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "violinha.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua General Vargas, 31",
    "addressLocality": "Novo Hamburgo",
    "addressRegion": "RS",
    "postalCode": "93534-530",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -29.674602,
    "longitude": -51.102520
  },
  "telephone": "51 991646694",
  "url": "https://violinha.com.br",
  "servesCuisine": "Frutos do mar empanados",
  "priceRange": "R$R$"
}
```

### RF05 — Guia de Preparo
Página dedicada (`/como-preparar`) com instruções técnicas de fritura: o peixe deve ir **congelado** ao óleo a 180°C — similar a fritar batata pré-frita.

### RF06 — Guia de Tradições e Espécies
Página informativa sobre peixes de escama vs. couro para auxiliar clientes com preceitos religiosos ou restrições alimentares.

### RF07 — Aviso de Atendimento
Componente visual fixo, exibido em destaque em todas as páginas, comunicando que:

> **"Antes de se deslocar, confirme via WhatsApp se haverá alguém para te atender."**

- Não há estados dinâmicos (`plantao`, `quaresma` etc.) — o aviso é sempre o mesmo.
- Não há campo de status no `data.json` — zero manutenção.
- O CTA do componente deve abrir o WhatsApp com uma mensagem do tipo: *"Olá! Gostaria de confirmar se há alguém disponível para atendimento."*
- Período de plantão de Páscoa (29/03 a 03/04/2026) pode ser mencionado **estaticamente** no copy do componente durante esse período, se desejado — mas sem automação.

### RF08 — Chamadas para Ação (CTA)
Botões integrados ao WhatsApp com mensagem contextual: `"Olá! Gostaria de consultar a disponibilidade de [Nome do Produto]."`.

### RF09 — Mapa de Localização
Página de contato com mapa incorporado (Google Maps embed via coordenadas) e orientações de chegada.

### RF10 — Sitemap Dinâmico
Geração de `/sitemap.xml` contemplando todas as rotas estáticas e dinâmicas de produtos ativos.

---

## 4. Requisitos Não Funcionais (RNF)

### RNF01 — Stack Tecnológica
Node.js, Express, Tailwind CSS, JSON como fonte de dados (podendo evoluir para SQLite), PM2 para gestão de processo. **Sem área administrativa** — não há login/autenticação.

**Cache:** Implementar cache de views renderizadas com `Cache-Control: public, max-age=3600, stale-while-revalidate=3600` (1h fresco + 1h de revalidação em background). Dado que o tráfego será baixo, 1h é suficiente para ganho de performance sem o risco de manter preço desatualizado por 24h no browser do visitante.

> **O que significa `stale-while-revalidate`:** Quando o TTL de 1h expira, em vez de o usuário *esperar* a página ser gerada novamente, o browser/CDN entrega a versão cacheada antiga **imediatamente** e, em paralelo, faz uma nova requisição em background para atualizar o cache. O próximo visitante já recebe a versão atualizada. Zero latência percebida, dados sempre relativamente frescos.

### RNF02 — Performance
O site deve ser ultra-leve e otimizado para dispositivos móveis (**Mobile First** — 375x667px iPhone SE2). Meta: **Core Web Vitals verdes** no PageSpeed Insights. Uso de imagens WebP e Lazy Loading.

### RNF03 — Infraestrutura
Deploy em Debian 12 com Nginx como Proxy Reverso e SSL via Let's Encrypt.

### RNF04 — Facilidade de Edição
O proprietário (o próprio desenvolvedor) edita o `data.json` diretamente — inclusive pelo celular via SSH no servidor de hospedagem quando necessário. Solução suficiente para o volume e frequência de mudanças previstas.

### RNF05 — SEO Local e Hiperlocal
Estratégia de saturação de metadados:
- Estrutura de cabeçalhos (`H1`, `H2`) focada em termos como **"Violinha empanada"**, **"Peixe para Páscoa"**, **"Novo Hamburgo"**, **"Bairro São Jorge"**.
- Schema.org `LocalBusiness` na homepage (ver RF04b).
- Schema.org `Product` nas páginas de produto.
- Open Graph e Twitter Cards em todas as páginas (ver RF04).
- `robots.txt` apontando para o sitemap (arquivo já criado em `public/robots.txt`).
- Após o lançamento: submeter o sitemap no **Google Search Console** e atualizar o **Google Business Profile** com o novo domínio.

---

## 5. Observações de Negócio e Nuances

- **Logística:** O site deve deixar explícito que **NÃO há serviço de entrega (Delivery)**. A venda é exclusivamente retirada no balcão.
- **Gestão de Estoque:** Não implementar sistema de "Reservas" ou "Carrinho". O foco é o diálogo via WhatsApp para evitar furos de estoque físico.
- **Alérgicos e Restrições:**
  - A Violinha, o filé de traíra e o Rosado *empanados* são Naturalmente Sem Glúten (farinha de milho).
  - Futuro item (Camarão a Milanesa) contém glúten e ovos; o site deve estar preparado para essa distinção clara via badge/borda indicativa.
- **Tom de Voz:** Informal, familiar e técnico quanto à qualidade do peixe (limpeza, retalhado manual na traíra para evitar espinhas).
- **B2B:** Fora do escopo da v1. Copy B2B (padronização de corte para restaurantes) entra após a Páscoa.

---

## 6. Estrutura proposta de Dados — Schema JSON

```json
{
  "config": {
    "whatsapp": "5551991646694",
    "whatsapp_mensagem_padrao": "Olá! Gostaria de consultar a disponibilidade de {produto}."
  },
  "produtos": [
    {
      "slug": "violinha-empanada",
      "nome": "Violinha Empanada",
      "categoria": "couro",
      "ativo": true,
      "em_estoque": true,
      "empanado": true,
      "contem_gluten": false,
      "alergenos": [],
      "pesos_disponiveis": ["500g", "1kg"],
      "peso_padrao": "1kg",
      "preco_por_peso": {
        "500g": 25.00,
        "1kg": 50.00
      },
      "imagem": "/img/violinha-empanada.webp",
      "descricao_seo": "A verdadeira violinha, temperada e empanada em farinha de milho. É só fritar.",
      "descricao_longa": "A Violinha é um peixe de couro característico da região, de sabor suave e textura firme após a fritura. Temperada e empanada artesanalmente em farinha de milho — naturalmente sem glúten. Vai direto do congelador para o óleo quente.",
      "instrucoes": "Fritar ainda congelado em óleo a 180°C por aproximadamente 3–4 minutos, ou até dourar."
    }
  ]
}
```

**Campos obrigatórios no schema:**

| Campo | Tipo | Comportamento |
|---|---|---|
| `slug` | string | URL amigável — kebab-case, sem acentos |
| `nome` | string | Nome de exibição |
| `categoria` | `"couro"` \| `"escama"` | Taxonomia biológica |
| `ativo` | boolean | `false` → some da home E a rota retorna página "indisponível" |
| `em_estoque` | boolean | `false` → some da home mas **mantém página própria** (SEO aquecido) |
| `contem_gluten` | boolean | Para badge de alérgenos |
| `alergenos` | string[] | Ex: `["gluten", "ovos"]` |
| `pesos_disponiveis` | string[] | Opções de gramagem |
| `peso_padrao` | string | Gramagem principal (afeta SEO do título) |
| `preco_por_peso` | object | Mapa peso → preço em R$ |
| `imagem` | string | Path relativo à pasta `public/` — formato `.webp` |
| `descricao_seo` | string | Meta description (~155 chars) |
| `descricao_longa` | string | Corpo da página de produto (para ranqueamento) |
| `instrucoes` | string | Resumo do modo de preparo |

**Lógica de exibição:**

| `ativo` | `em_estoque` | Home (cards) | Página `/peixe/slug` |
|---|---|---|---|
| `true` | `true` | ✅ Aparece | ✅ Disponível |
| `true` | `false` | ❌ Oculto | ✅ "Produto sem estoque no momento" |
| `false` | qualquer | ❌ Oculto | ❌ 404 / "Indisponível" |

---

## 7. Acessibilidade (A11y)

O público-alvo inclui **pessoas idosas**, que tendem a acessar mais pelo WhatsApp ou presencialmente do que via site. Ainda assim, o site deve ser acessível:

- **Contraste:** WCAG AA mínimo (4.5:1 para texto normal). **Atenção:** texto âmbar (`#f59e0b`) sobre fundo branco (`#f8fafc`) falha nesse critério — usar âmbar apenas como cor de fundo de badge (fundo âmbar + texto escuro), nunca como cor de texto sobre fundo claro.
- **Touch Targets:** Mínimo 44×44px em todos os elementos clicáveis — conforme `project-standards.md` seção 3.2.
- **Tamanho de fonte:** Mínimo `16px` no corpo do texto para conforto de leitura mobile em telas pequenas.
- **ARIA Labels:** Botões de CTA do WhatsApp devem ter `aria-label` descritivo (ex: `aria-label="Consultar disponibilidade de Violinha Empanada via WhatsApp"`).
- **Semântica HTML5:** `<header>`, `<main>`, `<article>`, `<footer>`, um único `<h1>` por página.

---

## 8. Infraestrutura e Ambientes

### 8.1 Variáveis de Ambiente (`.env`)

Um único arquivo `.env` na raiz define o comportamento por ambiente. O `.env` **nunca entra no Git** (adicionar ao `.gitignore`).

```dotenv
# Ambiente: 'development' ou 'production'
NODE_ENV=development

PORT=3008

# URL base do site (sem trailing slash)
BASE_URL=http://localhost:3008
# Em produção: BASE_URL=https://violinha.com.br
```

Usado para:
- Gerar URLs canônicas e og:url corretas em cada ambiente.
- Ativar/desativar minificação de assets.
- Configurar nível de log.

### 8.2 Git e Versionamento

- **Repositório:** Git (GitHub ou similar).
- **Branch único:** `main` — commits diretos, sem `develop`.
- **Ambientes:** Mac OS Sequoia (dev) → Debian 12 (prod via pull + `pm2 restart`).
- **Padrão de commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) conforme `project-standards.md` seção 7.1.
- **`.gitignore` mínimo:** `node_modules/`, `.env`, `*.log`.

---

## 9. Identidade Visual e Estilização (Tailwind)

### 9.1 Paleta de Cores

| Nome | Hex | Tailwind | Uso |
|---|---|---|---|
| Azul Marinho | `#0f172a` | `slate-900` | Header, Footer |
| Dourado/Âmbar | `#f59e0b` | `amber-500` | CTAs, badges "Sem Glúten", ícones |
| Branco Gelo | `#f8fafc` | `slate-50` | Fundo de páginas |
| Verde Esmeralda | `#059669` | `emerald-600` | Status "Atendimento", ícone WhatsApp |

### 9.2 Tipografia

- **Títulos:** Sans-serif robusta — **Montserrat** ou **Inter** em negrito. Modernidade e clareza.
- **Corpo:** Sans-serif leve — `system-ui` ou **Roboto**. Foco em legibilidade mobile.
- **Destaques artesanais:** Fonte serifada clássica (opcional) em citações ou na história da empresa, reforçando os 15 anos de tradição.

### 9.3 Componentes Visuais

- **Cards de Produto:** `rounded-xl`, `shadow-md`, efeito de hover que destaca o produto.
- **Selos (Badges):**
  - `Couro` / `Escama`
  - `Sem Glúten` (âmbar)
  - `Contém Glúten` (vermelho — para o Camarão futuro)
  - `IQF — Congelado Individualmente`
- **Imagens:** Fotos reais com bordas levemente arredondadas e tratamento de cor que ressalte o dourado do empanamento.

### 9.4 Iconografia

Ícones simples (Lucide ou FontAwesome):
- 🌡️ Temperatura do óleo (Página de preparo)
- ❄️ Instrução de não descongelar
- 📍 Localização/Mapa
- 📱 WhatsApp