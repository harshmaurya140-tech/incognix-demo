import { redact, restore } from "incognix-core";

const SAMPLE_PROMPT =
  "Hi team, reach me at harsh@example.com or +91 9876543210. " +
  "My OpenAI key is sk-proj-1234567890abcdefghijklmnop, server IP is 192.168.1.42, " +
  "and test card is 4111 1111 1111 1111.";

const badgeColors = {
  none: "#e5e7eb",
  low: "#dbeafe",
  medium: "#fef3c7",
  high: "#fed7aa",
  critical: "#fecaca",
};

const inputEl = document.getElementById("prompt-input");
const countryEl = document.getElementById("country-select");
const resetBtn = document.getElementById("reset-btn");
const riskBar = document.getElementById("risk-bar");
const outputLabel = document.getElementById("output-label");
const outputBox = document.getElementById("output-box");
const tokensBox = document.getElementById("tokens-box");
const toggleBtn = document.getElementById("toggle-btn");

let showRestored = false;
inputEl.value = SAMPLE_PROMPT;

function render() {
  try {
    const result = redact(inputEl.value, { country: countryEl.value });
    const restoredText = restore(result.redactedText, result.tokens);

    const level = result.risk?.level || "none";
    const score = result.risk?.score ?? 0;
    const total = result.risk?.totalFindings ?? result.detections?.length ?? 0;
    const breakdown = result.risk?.breakdown || result.risk?.counts || {};

    const breakdownHtml = Object.entries(breakdown)
      .map(
        ([type, count]) =>
          `<span style="font-size: 12px; background: #f3f4f6; padding: 4px 10px; border-radius: 6px;">${type}: ${count}</span>`
      )
      .join("");

    riskBar.innerHTML = `
      <span style="background: ${badgeColors[level] || "#e5e7eb"}; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600;">
        Risk: ${level.toUpperCase()} (${score}/100)
      </span>
      <span style="font-size: 13px; color: #4b5563;">Findings: <strong>${total}</strong></span>
      ${breakdownHtml}
    `;

    outputLabel.textContent = showRestored
      ? "Restored Text (via restore())"
      : "Redacted Output (Safe to send to LLM)";
    toggleBtn.textContent = showRestored ? "Show Redacted" : "Test restore() Round-Trip";
    outputBox.textContent = showRestored ? restoredText : result.redactedText;
    tokensBox.textContent = JSON.stringify(result.tokens, null, 2);
  } catch (err) {
    outputBox.textContent = "Error: " + err.message;
  }
}

inputEl.addEventListener("input", render);
countryEl.addEventListener("change", render);
resetBtn.addEventListener("click", () => {
  inputEl.value = SAMPLE_PROMPT;
  render();
});
toggleBtn.addEventListener("click", () => {
  showRestored = !showRestored;
  render();
});

render();
