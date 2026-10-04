# WordPress SQL catalog

The catalog contains **844 statements** and **978 findings**. Only 35 statements have resolved table references; those references are a lower bound, not complete coverage.

## Reading the catalog

Use the [findings section](#findings) to understand what the analyzer found.

- Search for a statement by its SQL text.
- Inspect the evidence before drawing a conclusion.
  - Keep unresolved references visible.
  - Read the source alongside each finding.

> Missing references do not mean that a statement has no dependencies.

## Findings

| Dataset | Statements | Findings | Statements with resolved table references |
| :--- | ---: | ---: | ---: |
| WordPress | 844 | 978 | 35 |

```sql
SELECT statement_id, finding_kind, source_location, unresolved_reference_reason FROM catalog_findings WHERE dataset_name = 'WordPress' ORDER BY source_location;
```

- [x] Keep counts labeled.
- [ ] Resolve remaining references.

### Interpretation

The catalog reports what was observed. It does not claim that the unresolved statements have been fully analyzed.
