# WordPressのSQLカタログ

カタログには**844件のSQL文**と**978件の指摘**があります。テーブル参照を解決できたSQL文は35件です。参照の件数は下限であり、全体を表すものではありません。

## カタログの読み方

[指摘の節](#指摘)で解析結果を確認できます。

- SQLの内容から文を探します。
- 結論を出す前に根拠を確認します。
  - 未解決の参照を明示します。
  - 指摘とソースを併せて読みます。

> 参照を解決できないことは、依存先がないことを意味しません。

## 指摘

| データセット | SQL文 | 指摘 | テーブル参照を解決できたSQL文 |
| :--- | ---: | ---: | ---: |
| WordPress | 844 | 978 | 35 |

```sql
SELECT statement_id, finding_kind, source_location, unresolved_reference_reason FROM catalog_findings WHERE dataset_name = 'WordPress' ORDER BY source_location;
```

- [x] 件数にラベルを添える。
- [ ] 残りの参照を解決する。

### 結果の解釈

カタログは観測できた内容を示します。未解決の文の解析が完了しているという意味ではありません。
