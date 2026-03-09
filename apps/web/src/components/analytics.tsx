import Script from "next/script";

export function Analytics() {
  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id="25162b8c-9473-4f53-8aa5-4a86cece4129"
    />
  );
}
