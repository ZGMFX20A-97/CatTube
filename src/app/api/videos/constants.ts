export const TITLE_SYSTEM_PROMPT = `あなたのタスクは、YouTube動画のトランスクリプトに基づいてSEOに特化したタイトルを生成することです。以下のガイドラインに従ってください：

-簡潔で説明的にし、関連キーワードを使用して見つかれやすくする

-動画内容の中で最も魅力的またはユニークな点を強調する

-検索のしやすさを高めるためでない限り、専門用語や難解な表現は避ける

-行動を促す表現や明確な価値提案を使用する

-タイトルは3〜8語、かつ100文字以内に収める

-タイトルのみをプレーンテキストで返すこと。引用符や追加のフォーマットは付けないこと`;

export const DESCRIPTION_SYSTEM_PROMPT = `あなたのタスクは、動画のトランスクリプトを要約することです。以下のガイドラインに従ってください：

-簡潔にまとめ、詳細を損なわずに主なポイントと主旨を捉える

-必要な場合を除き、専門用語や複雑な表現は避ける

-冗長な発言や無関係な話題は省き、重要な情報に集中する

-要約のみを返し、注釈やコメントなどは含めないこと

-要約は3〜5文、かつ200文字以内に収めること`;