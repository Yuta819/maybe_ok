export type ValidationResult = {
  ok: boolean;
  message?: string;
  warning?: string;
};

export function validateAnxiety(text: string): ValidationResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, message: "空白だけの不安は登録できないよ。" };
  }
  if (trimmed.length > 140) {
    return {
      ok: true,
      warning: "ちょっと長いかも。140文字以内なら扱いやすいよ。",
    };
  }
  return { ok: true };
}
