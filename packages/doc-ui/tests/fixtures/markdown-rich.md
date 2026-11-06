# Catalog evidence

The catalog contains **844 statements** and **978 findings**.[^catalog]

## Read the evidence

> [!IMPORTANT]
> Only **35 of 844 statements** were resolved. Findings do not imply complete coverage.
>
> - Keep the unresolved statements visible.
> - Inspect the source before drawing a conclusion.

Coverage
: The share of statements whose references could be resolved.

```sql
-- Keep the original statement visible.
SELECT post_title FROM wp_posts WHERE post_status = 'publish';
```

The resolved share is $35 / 844$. The calculation is:

$$
\mathrm{coverage} = \frac{35}{844} \times 100\%
$$

## Follow the process

```mermaid
flowchart LR
  accTitle: From Markdown to a readable document
  accDescr: Markdown is parsed, then code and diagrams are rendered before HTML is written.
  A[Markdown] --> B[Parse]
  B --> C[Highlight code]
  B --> D[Render diagrams]
  C --> E[HTML]
  D --> E
```

```mermaid
sequenceDiagram
  accTitle: Generate once, read offline
  participant Author
  participant Generator
  participant Reader
  Author->>Generator: Markdown
  Generator->>Reader: HTML and embedded figures
  Note over Reader: Read without JavaScript
```

[^catalog]: WordPress SQL catalog: 844 statements, 978 findings, 35 resolved statements.
